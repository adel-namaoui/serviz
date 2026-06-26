"use client"
import Link from "next/link"
import { useTranslation } from "@/lib/locale-context"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"

export default function CategoriesClient({ cats }: { cats: any[] }) {
  const { t, locale } = useTranslation()

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-10 text-center">
          <h1 className="text-3xl font-bold mb-2">{t("home.categories.title")}</h1>
          <p className="text-muted-foreground">{t("home.categories.subtitle")}</p>
        </div>
      </div>
      <div className="container py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cats.map(cat => {
          const Icon = (Icons[cat.icon as keyof typeof Icons] as React.ElementType) ?? Icons.Layers
          const name = locale === "ar" ? cat.nameAr : cat.name

          return (
            <Link key={cat.id} href={`/categories/${cat.slug}`}>
              <div className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg transition-all">
                <div className="h-12 w-12 rounded-xl bg-secondary group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-all">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm">{name}</p>
                  {cat.comingSoon && <p className="text-[10px] text-primary font-bold mt-1 uppercase">{t("home.comingSoon")}</p>}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}