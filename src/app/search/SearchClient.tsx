"use client"
import { useTranslation } from "@/lib/locale-context"
import { ServiceCard } from "@/components/marketplace/ServiceCard"
import { Search as SearchIcon } from "lucide-react"
import Link from "next/link"

export default function SearchClient({ q, services, categories }: any) {
  const { t, locale } = useTranslation()

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">
        {q ? `${t("search.title")}: "${q}"` : t("common.search")}
      </h1>

      {services.length === 0 && categories.length === 0 ? (
        <div className="text-center py-20 bg-card border border-dashed rounded-3xl">
          <SearchIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
          <p className="text-muted-foreground">{t("search.noResults")}</p>
        </div>
      ) : (
        <div className="space-y-10">
          {/* Affichage des catégories trouvées */}
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {categories.map((c: any) => (
                <Link key={c.id} href={`/categories/${c.slug}`} className="px-4 py-2 bg-secondary rounded-xl text-sm font-bold">
                  {locale === 'ar' ? c.nameAr : c.name}
                </Link>
              ))}
            </div>
          )}

          {/* Affichage des services trouvés */}
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