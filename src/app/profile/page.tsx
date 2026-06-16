import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ShoppingBag, Settings, User } from "lucide-react"

export const metadata = { title: "حسابي" }

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login?from=/profile")

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { _count: { select: { ordersAsBuyer: true, services: true } } },
  })
  if (!user) redirect("/auth/login")

  const roleLabels = { CLIENT: "عميل", FREELANCER: "مستقل", ADMIN: "مدير" }

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
              <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
                {roleLabels[user.role]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-2xl">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-card border border-border rounded-2xl p-5 text-center">
            <p className="text-3xl font-bold text-primary">{user._count.ordersAsBuyer}</p>
            <p className="text-sm text-muted-foreground mt-1">طلب مقدّم</p>
          </div>
          {user.role === "FREELANCER" && (
            <div className="bg-card border border-border rounded-2xl p-5 text-center">
              <p className="text-3xl font-bold text-primary">{user._count.services}</p>
              <p className="text-sm text-muted-foreground mt-1">خدمة منشورة</p>
            </div>
          )}
        </div>

        {/* Quick links */}
        <div className="space-y-2">
          {[
            { href: "/profile/orders", icon: ShoppingBag, label: "طلباتي", desc: `${user._count.ordersAsBuyer} طلب` },
            ...(user.role === "ADMIN" ? [{ href: "/admin", icon: Settings, label: "لوحة التحكم", desc: "إدارة المنصة" }] : []),
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
