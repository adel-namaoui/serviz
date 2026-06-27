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
  
  // Vérification de l'ID utilisateur pour TypeScript
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مسجّل" }, { status: 401 })
  }

  try {
    // Vérification du rôle (on utilise le rôle de la session directement)
    if ((session.user as any).role !== "FREELANCER" && (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "المستقلون فقط يمكنهم إضافة خدمات" }, { status: 403 })
    }

    const body = await req.json()
    const parsed = schema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ 
        error: "بيانات غير صالحة", 
        details: parsed.error.flatten() 
      }, { status: 400 })
    }

    const { packages, ...data } = parsed.data

    // FIX #5 : Suppression de la logique "finalTitle" redondante.
    // Comme 'title' est obligatoire (min 5 chars), il ne sera jamais vide.
    // Le spread '...data' contient déjà 'title' et 'titleAr'.

    const service = await prisma.service.create({
      data: {
        ...data,
        sellerId: session.user.id,
        // Utilisation de 'create' au lieu de 'createMany' pour une meilleure compatibilité Prisma
        packages: packages.length > 0 ? {
          create: packages 
        } : undefined,
      },
      include: { 
        packages: true, 
        subCategory: { include: { category: true } } 
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (e: any) {
    console.error("Service Creation Error:", e)
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 })
  }
}