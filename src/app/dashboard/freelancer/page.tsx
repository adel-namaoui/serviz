import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DollarSign, Package, ShoppingBag, Plus, Clock, Star, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { StatusUpdater } from "@/components/dashboard/StatusUpdater"
import { ServiceToggle } from "@/components/dashboard/ServiceToggle"

export const metadata = { title: "لوحة المستقل | سيرفيز" }

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  PENDING:     { label: "انتظار",       color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20" },
  IN_PROGRESS: { label: "جارٍ التنفيذ", color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
  REVISION:    { label: "مراجعة",       color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
  DELIVERED:   { label: "تم التسليم",  color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
  COMPLETED:   { label: "مكتمل",        color: "text-primary",                          bg: "bg-primary/10 border-primary/20" },
  CANCELLED:   { label: "ملغي",         color: "text-destructive",                      bg: "bg-destructive/10 border-destructive/20" },
}

export default async function FreelancerDashboard() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login?from=/dashboard/freelancer")
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role === "CLIENT") redirect("/")

  // ── Stats ────────────────────────────────────────────────────
  const [totalOrders, pendingCount, earningsResult, services] = await Promise.all([
    prisma.order.count({ where: { service: { sellerId: user.id } } }),
    prisma.order.count({ where: { service: { sellerId: user.id }, status: { in: ["PENDING", "IN_PROGRESS", "REVISION"] } } }),
    prisma.order.aggregate({
      where: { service: { sellerId: user.id }, status: { in: ["DELIVERED", "COMPLETED"] } },
      _sum: { totalPrice: true },
    }),
    prisma.service.findMany({
      where: { sellerId: user.id },
      include: { subCategory: { include: { category: true } }, _count: { select: { orders: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const earnings = earningsResult._sum.totalPrice ?? 0

  const orders = await prisma.order.findMany({
    where: { service: { sellerId: user.id } },
    include: {
      buyer: { select: { name: true, email: true } },
      service: { select: { title: true, titleAr: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  })

  const stats = [
    { icon: ShoppingBag, label: "إجمالي الطلبات", value: totalOrders,       color: "text-blue-500 bg-blue-500/10" },
    { icon: Clock,       label: "طلبات نشطة",      value: pendingCount,      color: "text-orange-500 bg-orange-500/10" },
    { icon: Package,     label: "خدماتي",           value: services.length,   color: "text-purple-500 bg-purple-500/10" },
    { icon: DollarSign,  label: "الإيرادات",        value: `$${earnings.toFixed(0)}`, color: "text-emerald-500 bg-emerald-500/10" },
  ]

  return (
    <div>
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold">لوحة المستقل</h1>
            <p className="text-sm text-muted-foreground mt-0.5">أهلاً {user.name} — إدارة خدماتك وطلباتك</p>
          </div>
          <Link href="/dashboard/new-service"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 active:scale-[0.97] transition-all">
            <Plus className="h-4 w-4" /> إضافة خدمة جديدة
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

        {/* My Services */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold">خدماتي ({services.length})</h2>
            <Link href="/dashboard/new-service" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
              <Plus className="h-3.5 w-3.5" /> إضافة خدمة
            </Link>
          </div>

          {services.length === 0 ? (
            <div className="bg-card border border-border border-dashed rounded-2xl p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">لا توجد خدمات بعد</h3>
              <p className="text-sm text-muted-foreground mb-5">أضف خدمتك الأولى وابدأ في استقبال الطلبات</p>
              <Link href="/dashboard/new-service"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">
                <Plus className="h-4 w-4" /> إضافة خدمة
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map(svc => (
                <div key={svc.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <div className="h-32 bg-secondary relative">
                    {svc.images?.[0]
                      ? <img src={svc.images[0]} alt={svc.title} className="w-full h-full object-cover" />
                      : <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-muted-foreground/8 select-none">SZ</div>
                    }
                    <div className={cn("absolute top-2 end-2 px-2 py-0.5 rounded-full text-[10px] font-semibold border",
                      svc.isActive ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" : "bg-secondary text-muted-foreground border-border")}>
                      {svc.isActive ? "نشط" : "مخفي"}
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground">{svc.subCategory.category.nameAr} / {svc.subCategory.nameAr}</p>
                      <p className="font-semibold text-sm mt-0.5 line-clamp-1 leading-snug">{svc.titleAr ?? svc.title}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><ShoppingBag className="h-3 w-3" />{svc._count.orders} طلب</span>
                      {svc.reviewCount > 0 && <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{svc.rating.toFixed(1)}</span>}
                      <span className="font-bold text-primary ms-auto">${svc.price}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                      <Link href={`/service/${svc.id}`}
                        className="flex-1 flex items-center justify-center gap-1.5 h-8 rounded-lg border border-border hover:bg-secondary text-xs font-medium transition-all">
                        <Eye className="h-3.5 w-3.5" /> عرض
                      </Link>
                      {/* CORRECTION 1 : isActive devient initialState */}
                      <ServiceToggle serviceId={svc.id} initialState={svc.isActive} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Incoming orders */}
        <div>
          <h2 className="font-bold mb-4">الطلبات الواردة ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-12 text-center">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">لم تستقبل أي طلب après</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground">
                      {["رقم","الخدمة","العميل","السعر","الحالة","تغيير"].map(h => (
                        <th key={h} className="px-4 py-3 text-start font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {orders.map(o => {
                      const st = statusConfig[o.status] || statusConfig.PENDING
                      return (
                        <tr key={o.id} className="hover:bg-secondary/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground">#{o.id.slice(-6).toUpperCase()}</td>
                          <td className="px-4 py-3 max-w-[160px]"><p className="text-xs font-medium line-clamp-1">{o.service.titleAr ?? o.service.title}</p></td>
                          <td className="px-4 py-3"><p className="text-xs font-medium">{o.buyer.name}</p></td>
                          <td className="px-4 py-3 font-bold text-primary text-xs">${o.totalPrice}</td>
                          <td className="px-4 py-3">
                            <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap", st.bg, st.color)}>{st.label}</span>
                          </td>
                          <td className="px-4 py-3">
                            {/* CORRECTION 2 : On ne passe plus nextStatuses ni statusConfig */}
                            <StatusUpdater orderId={o.id} currentStatus={o.status} />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}