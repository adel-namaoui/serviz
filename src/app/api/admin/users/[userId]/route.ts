import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 403 })

  const { userId } = await params

  try {
    // ORDRE DE SUPPRESSION CRUCIAL (Transaction)
    await prisma.$transaction([
      // 1. Supprimer les avis (ceux écrits par lui ET ceux sur ses services)
      prisma.review.deleteMany({ where: { OR: [{ authorId: userId }, { service: { sellerId: userId } }] } }),
      
      // 2. Supprimer les commandes (celles qu'il a achetées ET celles qu'il a vendues)
      prisma.order.deleteMany({ where: { OR: [{ buyerId: userId }, { service: { sellerId: userId } }] } }),
      
      // 3. Supprimer les packages de ses services
      prisma.package.deleteMany({ where: { service: { sellerId: userId } } }),
      
      // 4. Supprimer ses services
      prisma.service.deleteMany({ where: { sellerId: userId } }),
      
      // 5. Supprimer ses sessions et comptes auth
      prisma.account.deleteMany({ where: { userId: userId } }),
      prisma.session.deleteMany({ where: { userId: userId } }),
      
      // 6. ENFIN, supprimer l'utilisateur
      prisma.user.delete({ where: { id: userId } }),
    ])

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error("Erreur suppression fatale:", e)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}