import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ serviceId: string }> }
) {
  const session = await auth()

  // Vérification de l'authentification
  if (!session?.user?.id) {
    return NextResponse.json({ error: "غير مسجّل" }, { status: 401 })
  }

  const { serviceId } = await params

  // FIX #10 : 1ère requête DB - On récupère le service
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  })

  if (!service) {
    return NextResponse.json({ error: "الخدمة غير موجودة" }, { status: 404 })
  }

  /**
   * FIX #10 : Optimisation de la performance
   * Au lieu de refaire un `prisma.user.findUnique`, on utilise le rôle 
   * qui est déjà stocké dans le jeton de session (JWT).
   */
  const userRole = (session.user as any).role
  const userId = session.user.id

  // Vérification des permissions (Admin ou Propriétaire du service)
  if (userRole !== "ADMIN" && service.sellerId !== userId) {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 })
  }

  // 2ème requête DB - Mise à jour
  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: { isActive: !service.isActive }
  })

  return NextResponse.json(updated)
}