import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Users, Package, ShoppingCart, LayoutGrid, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata = { title: "لوحة التحكم" }

const statusColors: Record<string, string> = {
  PENDING: "text-yellow-500", IN_PROGRESS: "text-blue-500",
  DELIVERED: "text-success", COMPLETED: "text-primary", CANCELLED: "text-destructive",
}
const statusLabels: Record<string, string> = {
  PENDING: "انتظار", IN_PROGRESS: "جارٍ", REVISION: "مراجعة",
  DELIVERED: "مسلّم", COMPLETED: "مكتمل", CANCELLED: "ملغي",
}

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login")
  if ((session.user as any).role !== "ADMIN") redirect("/")

  const [users, services, orders, categories] = await Promise.all([
    prisma.user.count(),
    prisma.service.count(),
    prisma.order.count(),
    prisma.category.count(),
  ])

  const recentOrders = await prisma.order.findMany({
    take: 8, orderBy: { createdAt: "desc" },
    include: { buyer: { select: { name: true } }, service: { select: { title: true, titleAr: true } } },
  })

  const totalRevenue = await prisma.order.aggregate({
    where: { status: { in: ["DELIVERED", "COMPLETED"] } }, _sum: { totalPrice: true },
  })

  const stats = [
    { icon: Users, label: "مستخدمون", value: users, color: "text-blue-500 bg-blue-500/10" },
    { icon: Package, label: "خدمات", value: services, color: "text-purple-500 bg-purple-500/10" },
    { icon: ShoppingCart, label: "طلبات", value: orders, color: "text-primary bg-primary/10" },
    { icon: TrendingUp, label: "إيرادات", value: `$${(totalRevenue._sum.totalPrice ?? 0).toFixed(0)}`, color: "text-success bg-success/10" },
  ]

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-8 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
            <p className="text-sm text-muted-foreground mt-0.5">إدارة منصة سيرفيز</p>
          </div>
          <Link href="/categories" className="px-4 py-2 rounded-xl text-sm border border-border hover:bg-secondary transition-all">
            تصفح الموقع
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
              <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Recent orders */}
        <div>
          <h2 className="font-bold mb-4">آخر الطلبات</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="px-4 py-3 text-start font-medium">رقم الطلب</th>
                    <th className="px-4 py-3 text-start font-medium">الخدمة</th>
                    <th className="px-4 py-3 text-start font-medium">العميل</th>
                    <th className="px-4 py-3 text-start font-medium">الحالة</th>
                    <th className="px-4 py-3 text-start font-medium">السعر</th>
                    <th className="px-4 py-3 text-start font-medium">التاريخ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentOrders.map(o => (
                    <tr key={o.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{o.id.slice(-6).toUpperCase()}</td>
                      <td className="px-4 py-3 max-w-[200px] truncate text-xs">{o.service.titleAr ?? o.service.title}</td>
                      <td className="px-4 py-3 text-xs">{o.buyer.name}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-semibold", statusColors[o.status] ?? "text-foreground")}>{statusLabels[o.status] ?? o.status}</span>
                      </td>
                      <td className="px-4 py-3 text-xs font-semibold text-primary">${o.totalPrice}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("ar-DZ")}</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground text-sm">لا توجد طلبات بعد</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
