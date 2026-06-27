import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ServiceClient from "./ServiceClient"

export async function generateMetadata({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params
  const s = await prisma.service.findUnique({ where: { id: serviceId } })
  return { title: s ? s.titleAr || s.title : "الخدمة" }
}

export default async function ServicePage({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params
  const session = await auth()

  const s = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      seller: { select: { id: true, name: true, bio: true, image: true } },
      subCategory: { include: { category: true } },
      packages: { orderBy: { price: "asc" } },
    },
  })

  if (!s) notFound()

  const canViewHidden = !!(session?.user?.id && (
    (session.user as any).role === "ADMIN" || session.user.id === s.sellerId
  ))

  if (!s.isActive && !canViewHidden) notFound()

  return <ServiceClient s={s} canViewHidden={canViewHidden} />
}