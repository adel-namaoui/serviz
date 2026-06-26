"use client"
import { useState, useMemo, useRef, useEffect } from "react" // Ajout de hooks
import { useRouter } from "next/navigation" // Ajout du router
import Link from "next/link"
import { ServiceCard } from "@/components/marketplace/ServiceCard"
import { Search, Star, Shield, Zap, ChevronLeft, X } from "lucide-react"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/locale-context"

type IconName = keyof typeof Icons

export default function HomeClient({ categories, featuredServices }: any) {
  const { t, locale } = useTranslation()
  const router = useRouter()
  
  // ÉTATS POUR LA RECHERCHE
  const [query, setQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Liste étendue pour les suggestions
  const allSuggestions = [
    "تصميم شعار", "Logo Design", "إدارة إنستغرام", "Social Media", 
    "مونتاج فيديو", "Video Editing", "موقع ويب", "Web Development", 
    "UGC", "تصوير منتجات", "Photography", "تعليق صوتي", "Voiceover",
    "كتابة محتوى", "Content Writing", "ترجمة", "Translation"
  ]

  // Filtrer les suggestions en fonction de ce que l'utilisateur tape
  const filteredSuggestions = useMemo(() => {
    if (query.length < 1) return []
    return allSuggestions.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5) // On en montre max 5
  }, [query])

  // FONCTION DE RECHERCHE
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowSuggestions(false)
    }
  }

  // Fermer les suggestions si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const statsList = [
    { v: "500+", l: t("home.stats.freelancers") },
    { v: "2,000+", l: t("home.stats.services") },
    { v: "1,500+", l: t("home.stats.clients") },
    { v: "4.9★", l: t("home.stats.rating") }
  ]

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-20%,hsl(174,72%,42%,0.15),transparent)]" />
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-medium mb-6">
            <Star className="h-3 w-3 fill-primary" /> {t("home.hero.subtitle").split(',')[0]}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5 italic">
            {t("home.hero.title")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
            {t("home.hero.subtitle")}
          </p>

          {/* BARRE DE RECHERCHE AVEC AUTOCOMPLETE */}
          <div className="max-w-xl mx-auto relative" ref={searchRef}>
            <form 
              onSubmit={handleSearch}
              className="flex gap-2 p-1.5 rounded-2xl bg-card border border-border shadow-xl shadow-black/8 relative z-50"
            >
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input 
                  type="text" 
                  placeholder={t("home.hero.searchPlaceholder")}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full h-11 pr-9 pl-4 rounded-xl bg-secondary border-0 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                />
                {query && (
                  <button 
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1 hover:bg-border rounded-full transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
              <button 
                type="submit"
                className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 active:scale-[0.97] transition-all shrink-0"
              >
                {t("common.search")}
              </button>
            </form>

            {/* DROPDOWN DES SUGGESTIONS */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl z-40 overflow-hidden animate-fade-up py-2">
                {filteredSuggestions.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(s)
                      router.push(`/search?q=${encodeURIComponent(s)}`)
                      setShowSuggestions(false)
                    }}
                    className="w-full text-right px-5 py-3 text-sm hover:bg-secondary flex items-center gap-3 transition-colors"
                  >
                    <Search className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{s}</span>
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-2 mt-4 text-xs">
              <span className="text-muted-foreground">{t("home.popular")}</span>
              {["تصميم شعار", "إدارة إنستغرام", "UGC"].map(p => (
                <Link key={p} href={`/search?q=${encodeURIComponent(p)}`}
                  className="px-3 py-1 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary text-muted-foreground transition-all font-medium border border-transparent hover:border-primary/20">
                  {p}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ... Reste du code (Categories, Featured, Stats, CTA) identique ... */}
      {/* (Gardez le reste de votre fichier tel quel) */}
      
      {/* ── Categories ───────────────────────────────────────── */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">{t("home.categories.title")}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{t("home.categories.subtitle")}</p>
          </div>
          <Link href="/categories" className="flex items-center gap-1 text-sm text-primary hover:underline">
            {t("home.categories.viewAll")} <ChevronLeft className={cn("h-3.5 w-3.5", locale !== 'ar' && "rotate-180")} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {categories.map((cat: any) => {
            const Icon = (Icons[cat.icon as IconName] as React.ElementType) ?? Icons.Layers
            const name = locale === 'ar' ? cat.nameAr : cat.name
            
            return (
              <Link key={cat.id} href={`/categories/${cat.slug}`}>
                <div className={cn(
                  "group flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border h-full",
                  "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-150"
                )}>
                  <div className="h-10 w-10 rounded-xl bg-secondary group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">{name}</span>
                  {cat.comingSoon && <span className="text-[10px] text-muted-foreground">{t("home.comingSoon")}</span>}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Featured Services ─────────────────────────────────── */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">{t("home.featured.title")}</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{t("home.featured.subtitle")}</p>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {featuredServices.map((s: any) => (
            <ServiceCard key={s.id} {...s} sellerName={s.seller.name} price={s.packages[0]?.price ?? s.price} />
          ))}
        </div>
      </section>

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className="border-y border-border/50 bg-card/40">
        <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {statsList.map(({v, l}) => (
            <div key={l}><div className="text-2xl font-bold text-primary">{v}</div><div className="text-sm text-muted-foreground mt-0.5">{l}</div></div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="container py-16">
        <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-10 md:p-14 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">{t("home.cta.title")}</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">{t("home.cta.subtitle")}</p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all text-sm">
            {t("home.cta.button")}
          </Link>
        </div>
      </section>
    </div>
  )
}