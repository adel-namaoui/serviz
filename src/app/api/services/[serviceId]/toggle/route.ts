import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const session = await auth()

  if (!session?.user) {
    return NextResponse.json(
      { error: "غير مسجّل" },
      { status: 401 }
    )
  }

  const { serviceId } = await params

  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  })

  if (!service) {
    return NextResponse.json(
      { error: "الخدمة غير موجودة" },
      { status: 404 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  })

  if (!user) {
    return NextResponse.json(
      { error: "غير مصرح" },
      { status: 403 }
    )
  }

  if (user.role !== "ADMIN" && service.sellerId !== user.id) {
    return NextResponse.json(
      { error: "غير مصرح" },
      { status: 403 }
    )
  }

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: { isActive: !service.isActive }
  })

  return NextResponse.json(updated)
}