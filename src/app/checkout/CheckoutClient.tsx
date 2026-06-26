"use client"
import { useTranslation } from "@/lib/locale-context"
import { ChevronLeft, Clock, RefreshCw } from "lucide-react"
import Link from "next/link"
import { formatPrice, cn } from "@/lib/utils" // Import de 'cn' ajouté
import { CheckoutForm } from "@/components/marketplace/CheckoutForm"

export default function CheckoutClient({ service, packageId, price, days, rev, pkg }: any) {
  const { t, locale } = useTranslation()
  const displayTitle = locale === "ar" ? (service.titleAr || service.title) : service.title

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground">{t("common.home")}</Link>
            {/* CORRECTION ICI : Utilisation de className pour la taille */}
            <ChevronLeft className={cn("h-3.5 w-3.5", locale !== 'ar' && "rotate-180")} />
            <span className="text-foreground font-medium">{t("checkout.title")}</span>
          </nav>
          <h1 className="text-xl font-bold">{t("checkout.title")}</h1>
        </div>
      </div>

      <div className="container py-8 max-w-3xl grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="font-bold">{t("checkout.summary")}</h2>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">
                {locale === 'ar' ? service.subCategory.category.nameAr : service.subCategory.category.name}
              </p>
              <p className="font-semibold text-sm leading-snug">{displayTitle}</p>
              <p className="text-xs text-muted-foreground mt-1">{t("common.by")} {service.seller.name}</p>
            </div>
            
            {pkg && (
              <div className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-bold w-fit">
                {pkg.name}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{days} {t("card.days")}</span>
              <span className="flex items-center gap-1.5"><RefreshCw className="h-4 w-4" />{rev} {t("service.revisions")}</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-muted-foreground text-sm">{t("checkout.total")}</span>
              <span className="text-2xl font-bold text-primary">{formatPrice(price)}</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm h-fit">
          <h2 className="font-bold mb-4">{t("checkout.requirements")}</h2>
          <CheckoutForm serviceId={service.id} packageId={packageId} price={price} />
        </div>
      </div>
    </div>
  )
}