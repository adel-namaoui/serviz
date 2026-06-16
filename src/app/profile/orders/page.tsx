import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Package, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata = { title: "طلباتي" }

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING:     { label: "انتظار",      color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" },
  IN_PROGRESS: { label: "جارٍ",        color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  REVISION:    { label: "مراجعة",      color: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  DELIVERED:   { label: "تم التسليم", color: "bg-success/10 text-success border-success/20" },
  COMPLETED:   { label: "مكتمل",       color: "bg-primary/10 text-primary border-primary/20" },
  CANCELLED:   { label: "ملغي",        color: "bg-destructive/10 text-destructive border-destructive/20" },
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login?from=/profile/orders")

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: { service: { include: { seller: { select: { name: true } }, subCategory: { include: { category: true } } } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-8">
          <h1 className="text-xl font-bold">طلباتي</h1>
          <p className="text-sm text-muted-foreground mt-1">{orders.length} طلب</p>
        </div>
      </div>

      <div className="container py-8 max-w-3xl">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">لا توجد طلبات بعد</h2>
            <p className="text-muted-foreground text-sm mb-6">ابدأ بتصفح الخدمات وتقديم طلبك الأول</p>
            <Link href="/categories" className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">
              تصفح الخدمات
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const st = statusMap[order.status] ?? { label: order.status, color: "bg-secondary border-border text-foreground" }
              return (
                <Link key={order.id} href={`/orders/${order.id}`}>
                  <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">{order.service.subCategory.category.nameAr} / {order.service.subCategory.nameAr}</p>
                        <p className="font-semibold text-sm leading-snug line-clamp-1">{order.service.titleAr ?? order.service.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">بواسطة {order.service.seller.name}</p>
                      </div>
                      <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0", st.color)}>{st.label}</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("ar-DZ", { dateStyle: "medium" })}
                      </span>
                      <span className="font-bold text-primary">${order.totalPrice}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
