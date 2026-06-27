import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ShoppingBag, Settings, TrendingUp, Package, Plus } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import { cn } from "@/lib/utils"

export const metadata = { title: "حسابي" }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login?from=/profile")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { _count: { select: { ordersAsBuyer: true, services: true } } },
  })
  if (!user) redirect("/auth/login")

  // Fix 7: Fetch revenue for freelancers
  const revenueResult = user.role === "FREELANCER"
    ? await prisma.order.aggregate({
        where: { service: { sellerId: user.id }, status: { in: ["DELIVERED", "COMPLETED"] } },
        _sum: { totalPrice: true },
      })
    : null
  const revenue = revenueResult?._sum?.totalPrice ?? 0

  const roleLabels: Record<string, string> = { CLIENT: "عميل", FREELANCER: "مستقل", ADMIN: "مدير" }
  const roleBg:     Record<string, string> = {
    CLIENT:     "bg-secondary text-muted-foreground border-border",
    FREELANCER: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    ADMIN:      "bg-primary/10 text-primary border-primary/20",
  }

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-10">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full bg-primary/15 flex items-center justify-center text-2xl font-bold text-primary">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
              <span className={cn("inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border", roleBg[user.role])}>
                {roleLabels[user.role]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-2xl">

        {/* Fix 6+7: Clickable stat cards with correct labels per role */}
        {user.role === "CLIENT" && (
          <div className="grid grid-cols-1 gap-4 mb-8">
            <Link href="/profile/orders">
              <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
                <div className="flex flex-col items-start justify-center">
                  {/* Fix 8 spacing: proper flex centering */}
                  <p className="text-3xl font-bold text-primary">{user._count.ordersAsBuyer}</p>
                  <p className="text-sm text-muted-foreground mt-1">طلباتي</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </Link>
          </div>
        )}

        {user.role === "FREELANCER" && (
          // Fix 6: Clickable dashboard cards for freelancers
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link href="/dashboard/freelancer">
              <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group">
                <p className="text-3xl font-bold text-primary">{user._count.services}</p>
                <p className="text-sm text-muted-foreground mt-1">خدماتي</p>
              </div>
            </Link>
            <Link href="/dashboard/freelancer">
              <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
                {/* Fix 7: Show revenue instead of "orders submitted" */}
                <p className="text-2xl font-bold text-primary">{formatPrice(revenue)}</p>
                <p className="text-sm text-muted-foreground mt-1">الإيرادات</p>
              </div>
            </Link>
          </div>
        )}

        {user.role === "ADMIN" && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Link href="/admin">
              <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center hover:border-primary/40 hover:shadow-lg transition-all">
                <p className="text-3xl font-bold text-primary">{user._count.services}</p>
                <p className="text-sm text-muted-foreground mt-1">الخدمات</p>
              </div>
            </Link>
            <Link href="/admin">
              <div className="bg-card border border-border rounded-2xl p-5 flex flex-col items-center justify-center hover:border-primary/40 hover:shadow-lg transition-all">
                <p className="text-3xl font-bold text-primary">{user._count.ordersAsBuyer}</p>
                <p className="text-sm text-muted-foreground mt-1">الطلبات</p>
              </div>
            </Link>
          </div>
        )}

        {/* Fix 4+6: Separate quick-links per role */}
        <div className="space-y-2">
          {user.role === "CLIENT" && [
            { href: "/profile/orders", icon: ShoppingBag, label: "طلباتي", desc: `${user._count.ordersAsBuyer} طلب` },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <span className="text-muted-foreground text-lg">←</span>
            </Link>
          ))}

          {/* Fix 4: Freelancer gets separate My Services + Incoming Orders links */}
          {user.role === "FREELANCER" && [
            { href: "/dashboard/freelancer", icon: TrendingUp, label: "لوحة المستقل", desc: "طلباتي الواردة وخدماتي" },
            { href: "/dashboard/new-service", icon: Plus, label: "إضافة خدمة جديدة", desc: "أضف خدمة وابدأ الكسب" },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <span className="text-muted-foreground text-lg">←</span>
            </Link>
          ))}

          {user.role === "ADMIN" && [
            { href: "/admin", icon: Settings, label: "لوحة التحكم", desc: "إدارة المنصة" },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <span className="text-muted-foreground text-lg">←</span>
            </Link>
          ))}
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="mt-6 bg-card border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-2">نبذة</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  )
}