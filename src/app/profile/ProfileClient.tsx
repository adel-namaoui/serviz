"use client"
import { useTranslation } from "@/lib/locale-context"
import Link from "next/link"
import { ShoppingBag, Settings, TrendingUp, Plus } from "lucide-react"
import { formatPrice, cn } from "@/lib/utils"

export default function ProfileClient({ user, revenue }: any) {
  const { t } = useTranslation()

  const roleStyles: Record<string, string> = {
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
              <span className={cn("inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border", roleStyles[user.role as keyof typeof roleStyles])}>
                {t(`admin.role.${user.role.toLowerCase()}` as any)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 max-w-2xl">
        {/* Cartes de statistiques selon le rôle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {user.role === "CLIENT" && (
            <Link href="/profile/orders" className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:border-primary/40 transition-all">
              <div>
                <p className="text-3xl font-bold text-primary">{user._count.ordersAsBuyer}</p>
                <p className="text-sm text-muted-foreground">{t("nav.myOrders")}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-muted-foreground/20" />
            </Link>
          )}

          {user.role === "FREELANCER" && (
            <>
              <Link href="/dashboard/freelancer" className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all text-center">
                <p className="text-3xl font-bold text-primary">{user._count.services}</p>
                <p className="text-sm text-muted-foreground">{t("nav.myServices")}</p>
              </Link>
              <div className="bg-card border border-border rounded-2xl p-5 text-center">
                <p className="text-2xl font-bold text-primary">{formatPrice(revenue)}</p>
                <p className="text-sm text-muted-foreground">{t("profile.revenue")}</p>
              </div>
            </>
          )}
        </div>

        {/* Liens rapides */}
        <div className="space-y-2">
          {user.role === "FREELANCER" && (
            <Link href="/dashboard/new-service" className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Plus className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">{t("nav.addService")}</p>
              </div>
              <span className="text-muted-foreground">←</span>
            </Link>
          )}
          
          {user.role === "ADMIN" && (
            <Link href="/admin" className="flex items-center justify-between p-4 bg-card border border-border rounded-2xl hover:border-primary/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="font-medium text-sm">{t("nav.dashboard")}</p>
              </div>
              <span className="text-muted-foreground">←</span>
            </Link>
          )}
        </div>

        {user.bio && (
          <div className="mt-6 bg-card border border-border rounded-2xl p-5">
            <p className="text-sm font-semibold mb-2">{t("profile.bio")}</p>
            <p className="text-muted-foreground text-sm leading-relaxed">{user.bio}</p>
          </div>
        )}
      </div>
    </div>
  )
}