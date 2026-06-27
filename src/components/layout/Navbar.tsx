"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"
import {
  Search, Sun, Moon, User, LayoutDashboard,
  ShoppingBag, LogOut, Menu, X, ChevronDown,
  TrendingUp, Package, Settings
} from "lucide-react"
import { cn } from "@/lib/utils" 

// Imports pour la langue
import { useTranslation } from "@/lib/locale-context"
import { LanguageSwitcher } from "./LanguageSwitcher"

export function Navbar() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { t, locale } = useTranslation() // Hook de traduction
  const router = useRouter()
  
  const [q, setQ] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])
  
  // Gestion du scroll pour l'effet "glass"
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  // Fermer le menu utilisateur si on clique ailleurs
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`)
      setMobileOpen(false)
    }
  }

  const role = (session?.user as any)?.role
  const isFreelancer = role === "FREELANCER"
  const isAdmin      = role === "ADMIN"

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-300",
      scrolled ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border/50 py-2" : "bg-background border-b border-transparent py-4"
    )}>
      <div className="container flex h-10 items-center gap-4">
        
        {/* LOGO EN TEXTE STYLISÉ */}
        <Link href="/" className="shrink-0 flex items-center select-none group">
          <span className="text-2xl font-black tracking-tighter italic transition-all group-hover:scale-105">
            <span className="text-foreground">Brand</span>
            <span className="text-primary">DZ</span>
          </span>
        </Link>

        {/* Liens de navigation (Traduits) */}
        <nav className="hidden md:flex items-center gap-1 mx-2">
          <Link href="/categories" className="px-3 py-1.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
            {t("nav.browse")}
          </Link>
          {!isFreelancer && !isAdmin && (
            <Link href="/sell" className="px-3 py-1.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">
              {t("nav.sell")}
            </Link>
          )}
        </nav>

        {/* Barre de recherche (Placeholder traduit) */}
        <form onSubmit={search} className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="search" 
              placeholder={t("nav.search")} 
              value={q}
              onChange={e => setQ(e.target.value)}
              className="w-full h-10 pr-10 pl-4 rounded-2xl text-sm bg-secondary/50 border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
            />
          </div>
        </form>

        {/* Côté droit : Langue, Thème, Utilisateur */}
        <div className="flex items-center gap-2 ml-auto">
          
          <LanguageSwitcher />

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-10 w-10 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}

          {session?.user ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 h-10 px-2 rounded-2xl hover:bg-secondary transition-all border border-transparent hover:border-border"
              >
                <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-black text-primary shadow-inner">
                  {session.user.name?.[0]?.toUpperCase()}
                </div>
                <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", userOpen && "rotate-180")} />
              </button>

              {userOpen && (
                <div className="absolute top-full mt-2 end-0 w-56 rounded-[1.5rem] border border-border bg-popover shadow-2xl shadow-black/20 overflow-hidden animate-fade-up z-50 py-2">
                  <div className="px-4 py-3 border-b border-border/50 mb-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("nav.profile")}</p>
                    <p className="text-sm font-bold truncate">{session.user.name}</p>
                  </div>

                  {isAdmin && (
                    <Link href="/admin" onClick={() => setUserOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                      <LayoutDashboard className="h-4 w-4" /> {t("nav.dashboard")}
                    </Link>
                  )}

                  {isFreelancer && (
                    <>
                      <Link href="/dashboard/freelancer" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                        <TrendingUp className="h-4 w-4" /> {t("nav.myServices")}
                      </Link>
                      <Link href="/dashboard/sales" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                        <ShoppingBag className="h-4 w-4" /> {t("dash.incomingOrders")}
                      </Link>
                    </>
                  )}

                  <Link href="/profile/orders" onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                    <Package className="h-4 w-4" /> {t("nav.myOrders")}
                  </Link>

                  <Link href="/profile/settings" onClick={() => setUserOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors">
                    <Settings className="h-4 w-4" /> {locale === 'ar' ? 'الإعدادات' : 'Paramètres'}
                  </Link>

                  <div className="h-px bg-border/50 my-2" />

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-destructive hover:bg-destructive/5 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="hidden sm:flex h-10 px-4 items-center text-sm font-bold text-muted-foreground hover:text-primary transition-all">
                {t("nav.login")}
              </Link>
              <Link href="/auth/register" className="h-10 px-5 flex items-center text-sm font-black rounded-2xl bg-primary text-white hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95">
                {t("nav.register")}
              </Link>
            </div>
          )}

          <button
            className="md:hidden h-10 w-10 flex items-center justify-center rounded-2xl bg-secondary hover:bg-border transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Menu Mobile (Traduit) */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/50 bg-background animate-fade-up px-4 py-6 space-y-4 shadow-xl">
          <form onSubmit={search}>
            <input
              type="search" placeholder={t("nav.search")} value={q}
              onChange={e => setQ(e.target.value)}
              className="w-full h-12 px-4 rounded-2xl bg-secondary border border-border outline-none focus:border-primary"
            />
          </form>
          <nav className="flex flex-col gap-2">
            <Link href="/categories" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-2xl font-bold hover:bg-secondary transition-colors">
              {t("nav.browse")}
            </Link>
            {session && (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-2xl font-bold bg-primary/10 text-primary">
                {t("nav.dashboard")}
              </Link>
            )}
            {!session && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex h-12 items-center justify-center rounded-2xl border border-border font-bold">
                  {t("nav.login")}
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="flex h-12 items-center justify-center rounded-2xl bg-primary text-white font-bold">
                  {t("nav.register")}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}