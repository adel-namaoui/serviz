import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const packageSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().min(1),
  deliveryDays: z.number().int().positive(),
  revisions: z.number().int().min(0),
  features: z.array(z.string()).default([]),
})

const schema = z.object({
  title: z.string().min(5),
  titleAr: z.string().optional(),
  description: z.string().min(20),
  price: z.number().positive(),
  deliveryDays: z.number().int().positive().default(3),
  revisions: z.number().int().min(0).default(2),
  subCategoryId: z.string(),
  images: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  packages: z.array(packageSchema).max(3).default([]),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "غير مسجّل" }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role === "CLIENT") return NextResponse.json({ error: "المستقلون فقط يمكنهم إضافة خدمات" }, { status: 403 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة", details: parsed.error.flatten() }, { status: 400 })

  const { packages, ...data } = parsed.data

  // Use titleAr as title if title not provided
  const finalTitle = data.title || data.titleAr || ""

  const service = await prisma.service.create({
    data: {
      ...data,
      title: finalTitle,
      sellerId: user.id,
      packages: packages.length > 0 ? { createMany: { data: packages } } : undefined,
    },
    include: { packages: true, subCategory: { include: { category: true } } },
  })

  return NextResponse.json(service, { status: 201 })
}