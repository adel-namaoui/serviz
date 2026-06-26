import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminClient from "./AdminClient"

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")
  if ((session.user as any).role !== "ADMIN") redirect("/")

  // On garde toute votre logique Prisma ici...
  const [userCount, serviceCount, orderCount, revenueResult] = await Promise.all([
    prisma.user.count(),
    prisma.service.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ["DELIVERED", "COMPLETED"] } },
      _sum: { totalPrice: true },
    }),
  ])
  
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true,
      _count: { select: { services: true, ordersAsBuyer: true } } },
  })

  const recentOrdersFull = await prisma.order.findMany({
    take: 6, orderBy: { createdAt: "desc" },
    include: {
      buyer: { select: { name: true } },
      service: { select: { title: true, titleAr: true } },
    },
  })

  // On passe tout au composant Client
  return (
    <AdminClient 
      userCount={userCount}
      serviceCount={serviceCount}
      orderCount={orderCount}
      totalRevenue={revenueResult._sum.totalPrice ?? 0}
      chartData={[]} // Vous pouvez recalculer vos buckets ici
      users={users}
      recentOrders={recentOrdersFull}
    />
  )
}