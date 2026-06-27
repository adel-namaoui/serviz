import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

// FIX #2 : Définition des transitions de statut autorisées pour un vendeur
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["REVISION", "DELIVERED"],
  REVISION: ["DELIVERED"],
  DELIVERED: ["COMPLETED"], // Autorisé pour la démo MVP
}

const statusSchema = z.object({
  status: z.enum(["PENDING", "IN_PROGRESS", "REVISION", "DELIVERED", "COMPLETED", "CANCELLED"])
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const session = await auth()
  const { orderId } = await params
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauth" }, { status: 401 })
  }

  try {
    const body = await req.json()
    
    // 1. Valider le format du statut avec Zod
    const parsed = statusSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: "Statut invalide" }, { status: 400 })
    }
    const newStatus = parsed.data.status

    // 2. Récupérer la commande actuelle
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { service: true }
    })

    if (!order || order.service.sellerId !== session.user.id) {
      return NextResponse.json({ error: "Commande non trouvée" }, { status: 403 })
    }

    // 3. FIX #2 : Vérifier si la transition est logique
    // (Exemple : on ne peut pas annuler une commande déjà terminée)
    const allowed = ALLOWED_TRANSITIONS[order.status] || []
    if (!allowed.includes(newStatus) && order.status !== newStatus) {
      return NextResponse.json({ 
        error: `Transition impossible de ${order.status} vers ${newStatus}` 
      }, { status: 422 })
    }

    // 4. Mise à jour sécurisée
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Order Update Error:", error)
    return NextResponse.json({ error: "Update failed" }, { status: 500 })
  }
}