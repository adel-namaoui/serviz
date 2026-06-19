import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth()
  const { orderId } = await params
  
  if (!session?.user?.id) return NextResponse.json({ error: "Unauth" }, { status: 401 })

  try {
    const { status } = await req.json()

    // Vérifier que la commande appartient bien à un service de ce vendeur
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { service: true }
    })

    if (!order || order.service.sellerId !== session.user.id) {
      return NextResponse.json({ error: "Order not found or access denied" }, { status: 403 })
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId }, // UTILISER LA VARIABLE orderId
      data: { status }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}