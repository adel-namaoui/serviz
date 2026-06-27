import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import ProfileClient from "./ProfileClient"

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login?from=/profile")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { _count: { select: { ordersAsBuyer: true, services: true } } },
  })
  if (!user) redirect("/auth/login")

  const revenueResult = user.role === "FREELANCER"
    ? await prisma.order.aggregate({
        where: { service: { sellerId: user.id }, status: "COMPLETED" },
        _sum: { totalPrice: true },
      })
    : null
  const revenue = revenueResult?._sum?.totalPrice ?? 0

  return <ProfileClient user={user} revenue={revenue} />
}