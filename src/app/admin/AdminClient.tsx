"use client"
import { useTranslation } from "@/lib/locale-context"
import Link from "next/link"
import { Users, Package, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { RevenueChart } from "@/components/dashboard/RevenueChart"
import { UserTable } from "@/components/dashboard/UserTable"

export default function AdminClient({ 
  userCount, serviceCount, orderCount, totalRevenue, chartData, users, recentOrders 
}: any) {
  const { t } = useTranslation()

  // Configuration des statuts (utilisant les clés de traduction)
  const statusColors: Record<string, string> = {
    PENDING: "text-yellow-500", IN_PROGRESS: "text-blue-500",
    REVISION: "text-orange-500", DELIVERED: "text-emerald-500",
    COMPLETED: "text-primary", CANCELLED: "text-destructive",
  }

  const stats = [
    { icon: Users,        label: t("admin.users"),   value: userCount,              color: "text-blue-500 bg-blue-500/10" },
    { icon: Package,      label: t("admin.services"), value: serviceCount,           color: "text-purple-500 bg-purple-500/10" },
    { icon: ShoppingCart, label: t("admin.orders"),   value: orderCount,             color: "text-orange-500 bg-orange-500/10" },
    { icon: DollarSign,   label: t("admin.totalRevenue"), value: formatPrice(totalRevenue), color: "text-emerald-500 bg-emerald-500/10" },
  ]

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">{t("admin.title")}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{t("admin.subtitle")}</p>
          </div>
          <Link href="/" className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-secondary transition-all">
            {t("admin.browseSite")}
          </Link>
        </div>
      </div>

      <div className="container py-8 space-y-8">
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

        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold">{t("admin.revenueChart")}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{t("admin.revenueChartSubtitle")}</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-semibold text-primary">
              <TrendingUp className="h-4 w-4" />
              {formatPrice(totalRevenue)} {t("common.viewAll")}
            </div>
          </div>
          <RevenueChart data={chartData} />
        </div>

        <div>
          <h2 className="font-bold mb-4">{t("admin.recentOrders")}</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50">
                  <tr className="text-xs text-muted-foreground">
                    <th className="px-4 py-3 text-start">{t("admin.table.date")}</th>
                    <th className="px-4 py-3 text-start">{t("admin.table.service")}</th>
                    <th className="px-4 py-3 text-start">{t("admin.table.client")}</th>
                    <th className="px-4 py-3 text-start">{t("admin.table.status")}</th>
                    <th className="px-4 py-3 text-start">{t("admin.table.price")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {recentOrders.map((o: any) => (
                    <tr key={o.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-xs font-medium">{o.service.titleAr || o.service.title}</td>
                      <td className="px-4 py-3 text-xs">{o.buyer.name}</td>
                      <td className="px-4 py-3">
                        <span className={cn("text-xs font-semibold", statusColors[o.status])}>
                          {t(`order.status.${o.status.toLowerCase()}` as any)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs font-bold text-primary">{formatPrice(o.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold mb-4">{t("admin.manageUsers")}</h2>
          <UserTable users={users} />
        </div>
      </div>
    </div>
  )
}