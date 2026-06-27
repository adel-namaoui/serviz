"use client"
import { useTranslation } from "@/lib/locale-context"
import { ServiceCard } from "@/components/marketplace/ServiceCard"
import { Search as SearchIcon } from "lucide-react"
import Link from "next/link"

export default function SearchClient({ q, services, categories }: any) {
  const { t, locale } = useTranslation()

  return (
    <div className="container py-10 min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-8">
        {q ? `${t("search.title")}: "${q}"` : t("common.search")}
      </h1>

      {services.length === 0 && categories.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed rounded-[2.5rem]">
          <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/20" />
          <h2 className="text-xl font-bold mb-2">{t("search.noResults")}</h2>
          <p className="text-muted-foreground mb-8">{t("search.noResultsSubtitle")}</p>
          <Link href="/categories" className="bg-primary text-white px-8 py-3 rounded-xl font-bold">
            {t("nav.browse")}
          </Link>
        </div>
      ) : (
        <div className="space-y-12">
          {categories.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {categories.map((c: any) => (
                <Link key={c.id} href={`/categories/${c.slug}`} className="px-5 py-2 bg-secondary rounded-xl text-sm font-bold hover:text-primary transition-colors">
                  {locale === 'ar' ? c.nameAr : c.name}
                </Link>
              ))}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s: any) => (
              <ServiceCard key={s.id} {...s} sellerName={s.seller.name} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}