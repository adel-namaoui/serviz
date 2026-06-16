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
  
  // CORRECTION: On vérifie explicitement l'existence de l'ID
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مسجّل" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const p = schema.safeParse(body)
    if (!p.success) return NextResponse.json({ error: "بيانات خاطئة" }, { status: 400 })

    const service = await prisma.service.findUnique({ where: { id: p.data.serviceId } })
    if (!service) return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 })

    let price = service.price
    if (p.data.packageId) {
      const pkg = await prisma.package.findUnique({ where: { id: p.data.packageId } })
      if (pkg) price = pkg.price
    }

    // Ici, TypeScript sait que session.user.id est une string grâce au check au-dessus
    const order = await prisma.order.create({
      data: { 
        buyerId: session.user.id, 
        serviceId: p.data.serviceId, 
        packageId: p.data.packageId || null, // On force null si undefined
        requirements: p.data.requirements || "", 
        totalPrice: price, 
        status: "PENDING" 
      },
    })
    return NextResponse.json(order, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const session = await auth()
  
  // CORRECTION: On vérifie explicitement l'existence de l'ID
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مسجّل" }, { status: 401 })
  }

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id }, // Ici aussi, TypeScript est rassuré
    include: { service: { include: { seller: { select: { name: true } } } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(orders)
}