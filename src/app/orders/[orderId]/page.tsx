import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { CheckCircle2, Clock, ArrowLeft } from "lucide-react"
import { formatPrice } from "@/lib/utils"

export const metadata = { title: "تأكيد الطلب" }

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING:     { label: "قيد الانتظار", color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20" },
  IN_PROGRESS: { label: "قيد التنفيذ",  color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  REVISION:    { label: "مراجعة",        color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
  DELIVERED:   { label: "تم التسليم",   color: "bg-success/10 text-success border-success/20" },
  COMPLETED:   { label: "مكتمل",         color: "bg-primary/10 text-primary border-primary/20" },
  CANCELLED:   { label: "ملغي",          color: "bg-destructive/10 text-destructive border-destructive/20" },
}

export default async function OrderPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ orderId: string }>; 
  searchParams: Promise<{ success?: string }> 
}) {
  // Correction Next.js 15
  const { orderId } = await params
  const { success } = await searchParams

  const session = await auth()
  if (!session?.user) redirect("/auth/login")

  const order = await prisma.order.findUnique({
    where: { id: orderId, buyerId: session.user.id },
    include: { service: { include: { seller: { select: { name: true } }, subCategory: { include: { category: true } } } } },
  })
  if (!order) notFound()

  const status = statusMap[order.status] ?? { label: order.status, color: "bg-secondary text-foreground border-border" }

  return (
    <div className="container py-12 max-w-xl">
      {success && (
        <div className="text-center mb-10">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-success/10 mb-4">
            <CheckCircle2 className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">تم تأكيد طلبك!</h1>
          <p className="text-muted-foreground text-sm">سيتواصل معك المستقل في أقرب وقت ممكن</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="border-b border-border px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">رقم الطلب</p>
            <p className="font-mono font-bold">#{order.id.slice(-8).toUpperCase()}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>{status.label}</span>
        </div>

        <div className="p-6 space-y-5">
          <div>
            <p className="text-xs text-muted-foreground">{order.service.subCategory.category.nameAr} / {order.service.subCategory.nameAr}</p>
            <p className="font-semibold mt-1 leading-snug">{order.service.titleAr ?? order.service.title}</p>
            <p className="text-sm text-muted-foreground mt-1">بواسطة {order.service.seller.name}</p>
          </div>

          {order.requirements && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">متطلباتك</p>
              <p className="text-sm bg-secondary rounded-xl p-4 text-muted-foreground leading-relaxed">{order.requirements}</p>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {new Date(order.createdAt).toLocaleDateString("ar-DZ", { dateStyle: "long" })}
            </div>
            <span className="text-xl font-bold text-primary">{formatPrice(order.totalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Link href="/profile/orders" className="flex-1 h-11 flex items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors text-sm font-medium">
          طلباتي
        </Link>
        <Link href="/" className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-semibold">
          تصفح خدمات أخرى <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}