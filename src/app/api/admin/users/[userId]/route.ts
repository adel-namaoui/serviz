import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// Helper pour vérifier si l'utilisateur est Admin
async function isAdmin() {
  const session = await auth()
  if (!session?.user?.id) return false
  const user = await prisma.user.findUnique({ 
    where: { id: session.user.id },
    select: { role: true }
  })
  return user?.role === "ADMIN"
}

// 1. SUPPRIMER UN UTILISATEUR
export async function DELETE(
  _req: NextRequest, 
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 })
  }

  const { userId } = await params

  try {
    const target = await prisma.user.findUnique({ where: { id: userId } })
    if (!target) return NextResponse.json({ error: "المستخدم غير موجود" }, { status: 404 })
    if (target.role === "ADMIN") return NextResponse.json({ error: "لا يمكن حذف مدير آخر" }, { status: 422 })

    await prisma.user.delete({ where: { id: userId } })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: "خطأ في حذف المستخدم" }, { status: 500 })
  }
}

// 2. CHANGER LE RÔLE D'UN UTILISATEUR
const promoteSchema = z.object({ 
  role: z.enum(["CLIENT", "FREELANCER", "ADMIN"]) 
})

export async function PATCH(
  req: NextRequest, 
  { params }: { params: Promise<{ userId: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "غير مصرح لك" }, { status: 403 })
  }

  const { userId } = await params

  try {
    const body = await req.json()
    const parsed = promoteSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: "دور غير صالح" }, { status: 400 })

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: parsed.data.role },
      select: { id: true, name: true, role: true },
    })
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "خطأ في تحديث الدور" }, { status: 500 })
  }
}