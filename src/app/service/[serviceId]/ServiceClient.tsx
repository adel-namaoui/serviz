"use client"
import { useTranslation } from "@/lib/locale-context"
import Link from "next/link"
import { ChevronLeft, Star, Clock, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react"
import { formatPrice, cn } from "@/lib/utils"
import { OrderButton } from "@/components/marketplace/OrderButton"

export default function ServiceClient({ s, canViewHidden }: any) {
  const { t, locale } = useTranslation()
  const pkg = s.packages[0]

  // Logique de titre dynamique
  const displayTitle = locale === "ar" ? (s.titleAr || s.title) : s.title
  const catName = locale === "ar" ? s.subCategory.category.nameAr : s.subCategory.category.name
  const subName = locale === "ar" ? s.subCategory.nameAr : s.subCategory.name

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground">{t("common.home")}</Link>
            <ChevronLeft className={cn("h-3.5 w-3.5 shrink-0", locale !== 'ar' && "rotate-180")} />
            <Link href={`/categories/${s.subCategory.category.slug}`} className="hover:text-foreground">{catName}</Link>
            <ChevronLeft className={cn("h-3.5 w-3.5 shrink-0", locale !== 'ar' && "rotate-180")} />
            <span className="text-foreground font-medium">{subName}</span>
          </nav>
        </div>
      </div>

      <div className="container py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {!s.isActive && (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-2xl p-4 flex items-center gap-3 font-medium">
              <AlertTriangle className="h-5 w-5" />
              {t("dash.hidden")} — {t("dash.noServicesSubtitle")}
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold leading-tight">
            {displayTitle}
          </h1>

          {/* Seller Info */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-lg">
              {s.seller.name[0]}
            </div>
            <div>
              <p className="font-bold">{s.seller.name}</p>
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="font-bold">{s.rating.toFixed(1)}</span>
                <span className="text-muted-foreground">({s.reviewCount} {t("card.reviews")})</span>
              </div>
            </div>
          </div>

          {/* Main Image */}
          <div className="rounded-[2.5rem] overflow-hidden bg-slate-900 aspect-video flex items-center justify-center border border-border/50 shadow-xl">
            {s.images?.[0] ? (
              <img src={s.images[0]} alt={displayTitle} className="w-full h-full object-cover" />
            ) : (
              <span className="text-8xl font-black text-white/5 italic select-none">BrandDZ</span>
            )}
          </div>

          {/* Description */}
          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
               <div className="h-1.5 w-1.5 rounded-full bg-primary" /> {t("service.about")}
            </h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {s.description}
            </p>
          </div>

          {/* Packages Table */}
          {s.packages.length > 1 && (
            <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-sm">
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-border/50">
                {s.packages.map((p: any) => (
                  <div key={p.id} className="p-6 flex flex-col">
                    <p className="font-bold text-primary uppercase tracking-widest text-[10px] mb-1">{p.name}</p>
                    <p className="text-2xl font-black mb-3">{formatPrice(p.price)}</p>
                    <p className="text-xs text-muted-foreground mb-6 flex-1">{p.description}</p>
                    
                    <div className="space-y-3 mb-6">
                       <div className="flex items-center gap-2 text-xs font-medium">
                         <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {p.deliveryDays} {t("service.delivery")}
                       </div>
                       <div className="flex items-center gap-2 text-xs font-medium">
                         <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" /> {p.revisions} {t("service.revisions")}
                       </div>
                    </div>

                    <OrderButton serviceId={s.id} packageId={p.id} price={p.price} label={t("service.orderNow")} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-xl shadow-black/5">
            <div className="p-8 space-y-6">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">{t("service.startingFrom")}</p>
                <p className="text-4xl font-black text-primary">{formatPrice(pkg?.price ?? s.price)}</p>
              </div>

              <div className="flex flex-col gap-3 py-6 border-y border-border/50">
                <div className="flex items-center gap-3 text-sm font-bold">
                  <Clock className="h-5 w-5 text-primary" /> {pkg?.deliveryDays ?? s.deliveryDays} {t("service.delivery")}
                </div>
                <div className="flex items-center gap-3 text-sm font-bold">
                  <RefreshCw className="h-5 w-5 text-primary" /> {pkg?.revisions ?? s.revisions} {t("service.revisions")}
                </div>
              </div>

              <OrderButton
                serviceId={s.id}
                packageId={pkg?.id}
                price={pkg?.price ?? s.price}
                label={t("service.orderNow")}
              />
              
              <p className="text-[10px] text-center text-muted-foreground font-medium">
                {t("checkout.terms")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}