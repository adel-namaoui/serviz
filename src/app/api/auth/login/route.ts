import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user?.passwordHash) return NextResponse.json({ error: "بيانات خاطئة" }, { status: 401 })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: "بيانات خاطئة" }, { status: 401 })
    const { passwordHash: _, ...safe } = user
    return NextResponse.json(safe)
  } catch (e) {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}
