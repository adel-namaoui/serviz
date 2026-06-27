import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/utils" 
import FreelancerClient from "./FreelancerClient"

export default async function FreelancerDashboard() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login")
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role === "CLIENT") redirect("/")

  const [totalOrders, pendingCount, earningsResult, services] = await Promise.all([
    prisma.order.count({ where: { service: { sellerId: user.id } } }),
    prisma.order.count({ where: { service: { sellerId: user.id }, status: { in: ["PENDING", "IN_PROGRESS"] } } }),
    prisma.order.aggregate({ where: { service: { sellerId: user.id }, status: "COMPLETED" }, _sum: { totalPrice: true } }),
    prisma.service.findMany({ 
      where: { sellerId: user.id }, 
      include: { subCategory: true }, 
      orderBy: { createdAt: "desc" } 
    }),
  ])

  // FIX : On passe "iconName" en tant que texte (String)
  const stats = [
    { iconName: "ShoppingBag", label: "dash.totalOrders", value: totalOrders, color: "text-blue-500 bg-blue-500/10" },
    { iconName: "Zap", label: "dash.activeOrders", value: pendingCount, color: "text-amber-500 bg-amber-500/10" },
    { iconName: "LayoutGrid", label: "dash.myServices", value: services.length, color: "text-purple-500 bg-purple-500/10" },
    { iconName: "DollarSign", label: "dash.revenue", value: formatPrice(earningsResult._sum.totalPrice || 0), color: "text-emerald-500 bg-emerald-500/10" },
  ]

  return <FreelancerClient stats={stats} services={services} userName={user.name} />
}