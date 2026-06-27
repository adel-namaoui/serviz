import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// 1. SUPPRESSION (DELETE) - Sécurisée contre l'auto-suppression et les erreurs de clés étrangères
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth()
  
  // Vérification du rôle Admin
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { userId } = await params

  // FIX #3 : Empêcher l'admin de supprimer son propre compte
  if (userId === session?.user?.id) {
    return NextResponse.json({ error: "لا يمكنك حذف حسابك الخاص" }, { status: 400 })
  }

  try {
    // TRANSACTION : On nettoie tout ce qui est lié à l'utilisateur avant de le supprimer
    await prisma.$transaction([
      prisma.review.deleteMany({ where: { OR: [{ authorId: userId }, { service: { sellerId: userId } }] } }),
      prisma.order.deleteMany({ where: { OR: [{ buyerId: userId }, { service: { sellerId: userId } }] } }),
      prisma.package.deleteMany({ where: { service: { sellerId: userId } } }),
      prisma.service.deleteMany({ where: { sellerId: userId } }),
      prisma.account.deleteMany({ where: { userId: userId } }),
      prisma.session.deleteMany({ where: { userId: userId } }),
      prisma.user.delete({ where: { id: userId } }),
    ])

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Erreur suppression:", e)
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}

// 2. PROMOTION (PATCH) - Pour changer le rôle d'un utilisateur
const promoteSchema = z.object({ 
  role: z.enum(["CLIENT", "FREELANCER", "ADMIN"]) 
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth()
  if ((session?.user as any)?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const { userId } = await params

  try {
    const body = await req.json()
    const parsed = promoteSchema.safeParse(body)
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 })
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { role: parsed.data.role },
      select: { id: true, name: true, role: true },
    })
    
    return NextResponse.json(updated)
  } catch (e) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
}