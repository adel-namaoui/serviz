import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["CLIENT", "FREELANCER"]).default("CLIENT"),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const p = schema.safeParse(body)
    
    if (!p.success) {
      return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 })
    }

    const exists = await prisma.user.findUnique({ 
      where: { email: p.data.email } 
    })
    
    if (exists) {
      return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(p.data.password, 10)

    // CORRECTION ICI : On sépare "password" pour ne pas l'envoyer à Prisma
    const { password, ...userData } = p.data

    const user = await prisma.user.create({ 
      data: { 
        ...userData, // Contient name, email, role
        passwordHash // On ajoute le hash
      }, 
      select: { 
        id: true, 
        name: true, 
        email: true, 
        role: true 
      } 
    })

    return NextResponse.json(user, { status: 201 })
  } catch (e: any) {
    // On log l'erreur proprement pour éviter le crash du logger Next.js 15
    console.error("Erreur Prisma:", e.message || e)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}