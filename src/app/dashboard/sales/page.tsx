import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { cn, formatPrice } from "@/lib/utils" 
import { StatusUpdater } from "@/components/dashboard/StatusUpdater"
import { ChevronRight, ShoppingBag, User, ExternalLink, Clock } from "lucide-react"

export const metadata = { title: "إدارة المبيعات | BrandDZ" }

// Configuration des couleurs par statut
const statusStyles: Record<string, { label: string; class: string }> = {
  PENDING:     { label: "في الانتظار", class: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  IN_PROGRESS: { label: "قيد التنفيذ", class: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  REVISION:    { label: "مراجعة",       class: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  DELIVERED:   { label: "تم التسليم",  class: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  COMPLETED:   { label: "مكتمل",        class: "bg-primary/10 text-primary" },
  CANCELLED:   { label: "ملغي",         class: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400" },
}

export default async function SalesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login")

  const orders = await prisma.order.findMany({
    where: { service: { sellerId: session.user.id } },
    include: { 
      buyer: { select: { name: true, email: true } }, 
      service: { select: { titleAr: true, id: true } } 
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="container py-10 space-y-8 max-w-6xl">
      {/* Header avec bouton retour stylisé */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link 
            href="/dashboard/freelancer" 
            className="h-12 w-12 rounded-2xl bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            <ChevronRight className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight italic">إدارة <span className="text-primary not-italic">المبيعات</span></h1>
            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
              <ShoppingBag className="h-3.5 w-3.5" /> لديك {orders.length} طلبات من العملاء
            </p>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5">
        {orders.length === 0 ? (
          <div className="p-24 text-center space-y-4">
            <div className="h-20 w-20 bg-secondary rounded-full flex items-center justify-center mx-auto opacity-50">
               <ShoppingBag className="h-10 w-10" />
            </div>
            <p className="text-muted-foreground font-medium">لا توجد طلبات واردة بعد في حسابك.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="bg-secondary/30 text-xs font-bold text-muted-foreground uppercase tracking-widest border-b border-border/50">
                  <th className="p-6">الخدمة المطلوبة</th>
                  <th className="p-6">العميل</th>
                  <th className="p-6">تاريخ الطلب</th>
                  <th className="p-6">المبلغ</th>
                  <th className="p-6 text-center">الحالة الحالية</th>
                  <th className="p-6 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {orders.map(o => {
                  const style = statusStyles[o.status] || statusStyles.PENDING
                  return (
                    <tr key={o.id} className="hover:bg-secondary/10 transition-colors group">
                      <td className="p-6">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-sm group-hover:text-primary transition-colors line-clamp-1">
                            {o.service.titleAr}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-tighter">
                            ID: #{o.id.slice(-8)}
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {o.buyer.name[0]}
                          </div>
                          <div className="flex flex-col">
                             <span className="text-sm font-medium">{o.buyer.name}</span>
                             <span className="text-[10px] text-muted-foreground">{o.buyer.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(o.createdAt).toLocaleDateString('ar-DZ')}
                        </div>
                      </td>
                      <td className="p-6 font-black text-primary text-base">
                        {formatPrice(o.totalPrice)}
                      </td>
                      <td className="p-6 text-center">
                        <span className={cn(
                          "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border border-transparent shadow-sm",
                          style.class
                        )}>
                          {style.label}
                        </span>
                      </td>
                      <td className="p-6">
                        <div className="flex items-center justify-center gap-3">
                          <StatusUpdater orderId={o.id} currentStatus={o.status} />
                          <Link 
                            href={`/orders/${o.id}`} 
                            className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
                            title="عرض تفاصيل الطلب"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer info */}
      <p className="text-center text-[11px] text-muted-foreground italic">
        ملاحظة: يمكنك تغيير حالة الطلب لتتبع سير العمل مع العميل. سيصل إشعار للعميل عند كل تحديث.
      </p>
    </div>
  )
}