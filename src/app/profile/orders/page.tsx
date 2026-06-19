import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Package, Clock, Star } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { ReviewForm } from "@/components/marketplace/ReviewForm"

export const metadata = { title: "طلباتي" }

const statusConfig: Record<string, { label: string; color: string; bg: string; step: number }> = {
  PENDING:     { label: "في الانتظار",  color: "text-yellow-600 dark:text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/20", step: 1 },
  IN_PROGRESS: { label: "جارٍ التنفيذ", color: "text-blue-600 dark:text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20",    step: 2 },
  REVISION:    { label: "مراجعة",       color: "text-orange-500",                       bg: "bg-orange-500/10 border-orange-500/20", step: 2 },
  DELIVERED:   { label: "تم التسليم",  color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", step: 3 },
  COMPLETED:   { label: "مكتمل",        color: "text-primary",                          bg: "bg-primary/10 border-primary/20",      step: 4 },
  CANCELLED:   { label: "ملغي",         color: "text-destructive",                      bg: "bg-destructive/10 border-destructive/20", step: 0 },
}

const steps = ["في الانتظار", "جارٍ التنفيذ", "تم التسليم", "مكتمل"]

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login?from=/profile/orders")

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    include: {
      service: {
        include: {
          seller: { select: { name: true } },
          subCategory: { include: { category: true } },
        },
      },
      review: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-8">
          <h1 className="text-xl font-bold">طلباتي</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{orders.length} طلب</p>
        </div>
      </div>

      <div className="container py-8 max-w-3xl space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-2xl">
            <Package className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2">لا توجد طلبات بعد</h2>
            <p className="text-muted-foreground text-sm mb-6">اطلب خدمتك الأولى من مستقلينا</p>
            <Link href="/categories"
              className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">
              تصفح الخدمات
            </Link>
          </div>
        ) : (
          orders.map(order => {
            const st = statusConfig[order.status] ?? statusConfig.PENDING
            const currentStep = st.step
            const canReview = ["DELIVERED", "COMPLETED"].includes(order.status) && !order.review
            
            // Correction TypeScript : On force l'objet review pour éviter l'erreur 'never'
            const existingReview = order.review as any 

            return (
              <div key={order.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-border/50 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      {order.service.subCategory.category.nameAr} / {order.service.subCategory.nameAr}
                    </p>
                    <p className="font-semibold text-sm leading-snug line-clamp-1">
                      {order.service.titleAr ?? order.service.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">بواسطة {order.service.seller.name}</p>
                  </div>
                  <div className="text-end shrink-0">
                    <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", st.bg, st.color)}>
                      {st.label}
                    </span>
                    <p className="text-xs text-muted-foreground mt-1.5">{formatPrice(order.totalPrice)}</p>
                  </div>
                </div>

                {/* Progress bar — only for non-cancelled */}
                {order.status !== "CANCELLED" && (
                  <div className="px-5 py-4 border-b border-border/50">
                    <div className="flex items-center gap-0">
                      {steps.map((step, i) => {
                        const isActive = i < currentStep
                        const isCurrent = i === currentStep - 1
                        return (
                          <div key={step} className="flex-1 flex items-center">
                            <div className="flex flex-col items-center gap-1 shrink-0">
                              <div className={cn(
                                "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                                isActive
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "bg-secondary border-border text-muted-foreground"
                              )}>
                                {i + 1}
                              </div>
                              <span className={cn("text-[10px] whitespace-nowrap", isCurrent ? "text-primary font-semibold" : "text-muted-foreground")}>
                                {step}
                              </span>
                            </div>
                            {i < steps.length - 1 && (
                              <div className={cn("h-0.5 flex-1 mx-1 rounded transition-all", i < currentStep - 1 ? "bg-primary" : "bg-border")} />
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="px-5 py-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(order.createdAt).toLocaleDateString("ar-DZ", { dateStyle: "medium" })}
                  </span>
                  <Link href={`/service/${order.serviceId}`}
                    className="text-xs text-primary hover:underline">
                    عرض الخدمة →
                  </Link>
                </div>

                {/* Review section */}
                {canReview && (
                  <div className="border-t border-border/50 px-5 py-4 bg-secondary/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <p className="text-sm font-semibold">قيّم هذه الخدمة</p>
                    </div>
                    <ReviewForm orderId={order.id} serviceId={order.serviceId} />
                  </div>
                )}

                {/* Existing review (Correction ici) */}
                {existingReview && (
                  <div className="border-t border-border/50 px-5 py-4 bg-secondary/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      {[1,2,3,4,5].map(n => (
                        <Star key={n} className={cn("h-4 w-4", n <= existingReview.rating ? "fill-yellow-400 text-yellow-400" : "text-border")} />
                      ))}
                      <span className="text-xs text-muted-foreground ms-1">تقييمك</span>
                    </div>
                    {existingReview.comment && <p className="text-sm text-muted-foreground">{existingReview.comment}</p>}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}