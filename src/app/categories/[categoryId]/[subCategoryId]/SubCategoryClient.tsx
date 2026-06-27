"use client"
import { useTranslation } from "@/lib/locale-context"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { ServiceCard } from "@/components/marketplace/ServiceCard"
import { cn } from "@/lib/utils"

export default function SubCategoryClient({ cat, sub, allSubs }: any) {
  const { t, locale } = useTranslation()

  // Noms dynamiques selon la langue
  const catName = locale === 'ar' ? cat.nameAr : cat.name
  const subName = locale === 'ar' ? sub.nameAr : sub.name

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3 flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">
              {t("common.home")}
            </Link>
            <ChevronLeft className={cn("h-3.5 w-3.5 shrink-0", locale !== 'ar' && "rotate-180")} />
            <Link href={`/categories/${cat.slug}`} className="hover:text-foreground transition-colors">
              {catName}
            </Link>
            <ChevronLeft className={cn("h-3.5 w-3.5 shrink-0", locale !== 'ar' && "rotate-180")} />
            <span className="text-foreground font-medium">{subName}</span>
          </nav>
          <h1 className="text-xl font-bold italic">
            {locale === 'ar' ? `خدمات ${subName}` : `Services ${subName}`}
          </h1>
        </div>
      </div>

      <div className="container py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-52 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 mb-2">
              {t("search.categories")}
            </p>
            {allSubs.map((s: any) => (
              <Link 
                key={s.id} 
                href={`/categories/${cat.slug}/${s.slug}`}
                className={cn(
                  "block px-4 py-2.5 rounded-xl text-sm transition-all",
                  s.id === sub.id 
                    ? "bg-primary/10 text-primary font-bold border border-primary/20" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {locale === 'ar' ? s.nameAr : s.name}
              </Link>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-6 font-medium">
            {sub.services.length} {t("search.results")}
          </p>
          
          {sub.services.length === 0 ? (
            <div className="text-center py-24 bg-card border border-dashed rounded-[3rem]">
              <div className="text-5xl mb-4 opacity-20">📭</div>
              <h3 className="font-bold text-lg mb-1">{t("order.noOrders")}</h3>
              <p className="text-muted-foreground text-sm">{t("home.comingSoon")}</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sub.services.map((s: any) => (
                <ServiceCard 
                  key={s.id} 
                  {...s} 
                  sellerName={s.seller.name} 
                  sellerId={s.sellerId} // Important pour le lien profil
                  price={s.packages[0]?.price ?? s.price} 
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}