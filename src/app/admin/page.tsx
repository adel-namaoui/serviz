import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Users, Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { UserTable } from "@/components/dashboard/UserTable"

export const metadata = { title: "لوحة التحكم — Admin" }

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")
  if ((session.user as any).role !== "ADMIN") redirect("/")

  // ── Aggregate stats ──────────────────────────────────────────
  const [userCount, serviceCount, orderCount, revenueResult] = await Promise.all([
    prisma.user.count(),
    prisma.service.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ["DELIVERED", "COMPLETED"] } },
      _sum: { totalPrice: true },
    }),
  ])
  const totalRevenue = revenueResult._sum.totalPrice ?? 0

  // ── Revenue per month (last 6 months) ───────────────────────
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const recentOrders = await prisma.order.findMany({
    where: { createdAt: { gte: sixMonthsAgo }, status: { in: ["DELIVERED", "COMPLETED"] } },
    select: { totalPrice: true, createdAt: true },
  })

  // Build month buckets
  const monthLabels = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const buckets: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(); d.setMonth(d.getMonth() - i)
    const key = `${monthLabels[d.getMonth()]} ${d.getFullYear()}`
    buckets[key] = 0
  }
  recentOrders.forEach(o => {
    const d = new Date(o.createdAt)
    const key = `${monthLabels[d.getMonth()]} ${d.getFullYear()}`
    if (key in buckets) buckets[key] += o.totalPrice
  })
  const chartData = Object.entries(buckets).map(([month, revenue]) => ({ month, revenue: Math.round(revenue) }))

  // ── All users for management table ───────────────────────────
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true,
      _count: { select: { services: true, ordersAsBuyer: true } } },
  })

  // ── Recent orders ────────────────────────────────────────────
  const recentOrdersFull = await prisma.order.findMany({
    take: 6, orderBy: { createdAt: "desc" },
    include: {
      buyer:   { select: { name: true } },
      service: { select: { title: true, titleAr: true } },
    },
  })

  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-500", IN_PROGRESS: "text-blue-500",
    REVISION: "text-orange-500", DELIVERED: "text-emerald-500",
    COMPLETED: "text-primary", CANCELLED: "text-destructive",
  }
  const statusLabels: Record<string, string> = {
    PENDING: "انتظار", IN_PROGRESS: "جارٍ", REVISION: "مراجعة",
    DELIVERED: "مسلّم", COMPLETED: "مكتمل", CANCELLED: "ملغي",
  }

  const stats = [
    { icon: Users,       label: "المستخدمون",   value: userCount,              color: "text-blue-500 bg-blue-500/10" },
    { icon: Package,     label: "الخدمات",       value: serviceCount,           color: "text-purple-500 bg-purple-500/10" },
    { icon: ShoppingCart,label: "الطلبات",       value: orderCount,             color: "text-orange-500 bg-orange-500/10" },
    { icon: DollarSign,  label: "الإيرادات",     value: `$${totalRevenue.toFixed(0)}`, color: "text-emerald-500 bg-emerald-500/10" },
  ]

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">لوحة تحكم المدير</h1>
            <p className="text-sm text-muted-foreground mt-0.5">نظرة شاملة على منصة سيرفيز</p>
          </div>
          <Link href="/" className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-secondary transition-all">
            تصفح الموقع ←
          </Link>
        </div>
      </div>

      <div className="container py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mb-3", s.color)}>
                <s.icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold">الإيرادات الشهرية</h2>
              <p className="text-xs text-muted-foreground mt-0.5">آخر 6 أشهر</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
              <TrendingUp className="h-4 w-4" />
              ${totalRevenue.toFixed(0)} إجمالي
            </div>
          </div>
          <RevenueChart data={chartData} />
        </div>

        {/* Recent orders */}
        <div>
          <h2 className="font-bold mb-4">آخر الطلبات</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    {["رقم الطلب","الخدمة","العميل","الحالة","السعر","التاريخ"].map(h => (
                      <th key={h} className="px-4 py-3 text-start font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentOrdersFull.map(o => (
                    <tr key={o.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{o.id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 text-xs max-w-[180px]"><p className="line-clamp-1">{o.service.titleAr ?? o.service.title}</p></td>
                      <td className="px-4 py-3 text-xs">{o.buyer.name}</td>
                      <td className="px-4 py-3"><span className={cn("text-xs font-semibold", statusColors[o.status])}>{statusLabels[o.status]}</span></td>
                      <td className="px-4 py-3 text-xs font-bold text-primary">${o.totalPrice}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{new Date(o.createdAt).toLocaleDateString("fr-DZ")}</td>
                    </tr>
                  ))}
                  {recentOrdersFull.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">لا توجد طلبات بعد</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User management */}
        <div>
          <h2 className="font-bold mb-4">إدارة المستخدمين ({users.length})</h2>
          <UserTable users={users} />
        </div>
      </div>
    </div>
  )
}