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
  
  // Vérification stricte de l'ID utilisateur
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مسجّل" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 })

    const { orderId, serviceId, rating, comment } = parsed.data

    // On vérifie le type ici avec 'as any' si le generate n'est pas encore propagé
    const order = await prisma.order.findUnique({ 
      where: { id: orderId }, 
      include: { review: true } as any 
    })

    if (!order) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 })
    if (order.buyerId !== session.user.id) return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
    
    if (!["DELIVERED", "COMPLETED"].includes(order.status)) {
      return NextResponse.json({ error: "لا يمكن التقييم قبل استلام الخدمة" }, { status: 422 })
    }

    // Utilisation de 'as any' pour bypasser le lag de détection de Prisma
    if ((order as any).review) {
      return NextResponse.json({ error: "لقد قيّمت هذه الخدمة مسبقاً" }, { status: 409 })
    }

    // Transaction pour créer la review et mettre à jour la note moyenne du service
    const review = await prisma.$transaction(async (tx) => {
      const newReview = await (tx as any).review.create({
        data: { 
          orderId, 
          serviceId, 
          authorId: session.user!.id, 
          rating, 
          comment 
        },
      })

      // Recalcul de la moyenne
      const agg = await (tx as any).review.aggregate({ 
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
    console.error(e)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}