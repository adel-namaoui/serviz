import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({ 
  serviceId: z.string(), 
  packageId: z.string().optional(), 
  requirements: z.string().optional() 
})

export async function POST(req: NextRequest) {
  const session = await auth()
  
  // Vérification de l'authentification
  if (!session?.user?.id) {
    return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const p = schema.safeParse(body)
    if (!p.success) return NextResponse.json({ error: "بيانات خاطئة" }, { status: 400 })

    // 1. Récupérer le service pour vérifier le vendeur
    const service = await prisma.service.findUnique({ 
      where: { id: p.data.serviceId } 
    })

    if (!service) {
      return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 })
    }

    // FIX #7 : Empêcher l'auto-achat (Self-purchase guard)
    if (service.sellerId === session.user.id) {
      return NextResponse.json({ 
        error: "لا يمكنك شراء خدمتك الخاصة" 
      }, { status: 422 })
    }

    // 2. Déterminer le prix
    let price = service.price
    if (p.data.packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: p.data.packageId } })
      if (pkg) price = pkg.price
    }

    // 3. Création de la commande
    const order = await prisma.order.create({
      data: { 
        buyerId: session.user.id, 
        serviceId: p.data.serviceId, 
        packageId: p.data.packageId || null,
        requirements: p.data.requirements || "", 
        totalPrice: price, 
        status: "PENDING" 
      },
    })

    return NextResponse.json(order, { status: 201 })
  } catch (e: any) {
    console.error("Order Creation Error:", e)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مسجّل" }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: { 
      service: { 
        include: { 
          seller: { select: { name: true } } 
        } 
      } 
    },
    orderBy: { createdAt: "desc" },
  })
  
  return NextResponse.json(orders)
}