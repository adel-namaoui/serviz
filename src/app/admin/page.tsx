import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AdminClient from "./AdminClient"

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")
  if ((session.user as any).role !== "ADMIN") redirect("/")

  // 1. Stats globales
  const [userCount, serviceCount, orderCount, revenueResult] = await Promise.all([
    prisma.user.count(),
    prisma.service.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ["DELIVERED", "COMPLETED"] } },
      _sum: { totalPrice: true },
    }),
  ])

  // 2. Calcul des revenus pour le graphique (6 derniers mois)
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)

  const orders = await prisma.order.findMany({
    where: { 
      createdAt: { gte: sixMonthsAgo },
      status: { in: ["DELIVERED", "COMPLETED"] } 
    },
    select: { totalPrice: true, createdAt: true }
  })

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const chartMap: Record<string, number> = {}

  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const label = `${monthNames[d.getMonth()]}`
    chartMap[label] = 0
  }

  orders.forEach(order => {
    const label = monthNames[new Date(order.createdAt).getMonth()]
    if (chartMap[label] !== undefined) {
      chartMap[label] += order.totalPrice
    }
  })

  const chartData = Object.entries(chartMap).map(([month, revenue]) => ({
    month,
    revenue
  }))

  // 3. Utilisateurs et Commandes récentes
  const [users, recentOrders] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, role: true, createdAt: true,
        _count: { select: { services: true, ordersAsBuyer: true } } },
    }),
    prisma.order.findMany({
      take: 6, orderBy: { createdAt: "desc" },
      include: {
        buyer: { select: { name: true } },
        service: { select: { title: true, titleAr: true } },
      },
    })
  ])

  return (
    <AdminClient 
      userCount={userCount}
      serviceCount={serviceCount}
      orderCount={orderCount}
      totalRevenue={revenueResult._sum.totalPrice ?? 0}
      chartData={chartData}
      users={users}
      recentOrders={recentOrders}
    />
  )
}