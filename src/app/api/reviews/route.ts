import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  orderId:   z.string(),
  serviceId: z.string(),
  rating:    z.number().int().min(1).max(5),
  comment:   z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  
  // Vérification de l'authentification
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مسجّل" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 })

    const { orderId, serviceId, rating, comment } = parsed.data

    // FIX #4 : Suppression des 'as any'. Prisma reconnaît maintenant la relation 'review'
    const order = await prisma.order.findUnique({ 
      where: { id: orderId }, 
      include: { review: true } 
    })

    if (!order) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 })
    
    // Sécurité : Seul l'acheteur peut noter
    if (order.buyerId !== session.user.id) {
      return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    }
    
    // Logique métier : On ne note que ce qui est livré ou terminé
    if (!["DELIVERED", "COMPLETED"].includes(order.status)) {
      return NextResponse.json({ error: "لا يمكن التقييم قبل استلام الخدمة" }, { status: 422 })
    }

    // Vérification si un avis existe déjà (sans 'as any')
    if (order.review) {
      return NextResponse.json({ error: "لقد قيّمت هذه الخدمة مسبقاً" }, { status: 409 })
    }

    // Transaction sécurisée et typée
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.review.create({
        data: { 
          orderId, 
          serviceId, 
          authorId: session.user!.id, 
          rating, 
          comment 
        },
      })

      // Recalcul de la moyenne du service
      const agg = await tx.review.aggregate({ 
        where: { serviceId }, 
        _avg: { rating: true }, 
        _count: { rating: true } 
      })

      await tx.service.update({
        where: { id: serviceId },
        data: { 
          rating: agg._avg.rating ?? 0, 
          reviewCount: agg._count.rating 
        },
      })

      return newReview
    })

    return NextResponse.json(review, { status: 201 })
  } catch (e: any) {
    console.error("Review API Error:", e)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}