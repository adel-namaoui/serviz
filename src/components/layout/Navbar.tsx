"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"
import {
  Search, Sun, Moon, User, LayoutDashboard,
  ShoppingBag, LogOut, Menu, X, ChevronDown,
  TrendingUp, Package
} from "lucide-react"
import { cn } from "@/lib/utils" 

// NOUVEAUX IMPORTS POUR LA LANGUE
import { useTranslation } from "@/lib/locale-context"
import { LanguageSwitcher } from "./LanguageSwitcher"

export function Navbar() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation() // Hook pour traduire
  const router = useRouter()
  
  const [q, setQ] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])
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
      // On utilise router.push pour changer d'URL
      router.push(`/search?q=${encodeURIComponent(q.trim())}`)
      setMobileOpen(false)
    }
  }

  const role = (session?.user as any)?.role
  const isFreelancer = role === "FREELANCER"
  const isAdmin      = role === "ADMIN"
  const isClient     = role === "CLIENT" || !role

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      scrolled ? "glass shadow-sm" : "bg-background border-b border-border/50"
    )}>
      <div className="container flex h-16 items-center gap-3">
        {/* Logo */}
        {/* Logo en texte stylisé */}
        <Link href="/" className="shrink-0 flex items-center select-none group">
          <span className="text-2xl font-black tracking-tighter italic transition-all group-hover:scale-105">
            <span className="text-foreground">Brand</span>
            <span className="text-primary">DZ</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 mx-1">
          <Link href="/categories" className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
            {t("nav.browse")}
          </Link>
          {isClient && (
            <Link href="/sell" className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
              {t("nav.sell")}
            </Link>
          )}
        </nav>

        {/* Search */}
        <form onSubmit={search} className="hidden sm:flex flex-1 max-w-sm lg:max-w-md">
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="search" placeholder={t("nav.search")} value={q}
              onChange={e => setQ(e.target.value)}
              className="w-full h-9 pr-9 pl-3 rounded-xl text-sm bg-secondary border border-border placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </form>

        {/* Right side */}
        <div className="flex items-center gap-1 ml-auto">
          
          {/* SELECTEUR DE LANGUE */}
          <LanguageSwitcher />

          {/* Theme toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          {session?.user ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 h-9 px-2.5 rounded-xl hover:bg-secondary transition-all"
              >
                <div className="h-7 w-7 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="hidden md:inline text-sm font-medium max-w-[90px] truncate">
                  {session.user.name}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
              </button>

              {userOpen && (
                <div className="absolute top-full mt-1.5 end-0 w-52 rounded-xl border border-border bg-popover shadow-xl shadow-black/10 overflow-hidden animate-fade-up z-50 py-1">

                  {isAdmin && (
                    <>
                      <Link href="/admin" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                        <LayoutDashboard className="h-4 w-4" /> {t("nav.dashboard")}
                      </Link>
                      <div className="h-px bg-border/50 my-1" />
                    </>
                  )}

                  {isFreelancer && (
                    <>
                      <Link href="/dashboard/freelancer" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                        <TrendingUp className="h-4 w-4" /> {t("nav.myServices")}
                      </Link>
                      <Link href="/dashboard/new-service" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                        <Package className="h-4 w-4" /> {t("nav.addService")}
                      </Link>
                      <div className="h-px bg-border/50 my-1" />
                    </>
                  )}

                  <Link href="/profile/orders" onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <ShoppingBag className="h-4 w-4" /> {t("nav.myOrders")}
                  </Link>

                  <Link href="/profile" onClick={() => setUserOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <User className="h-4 w-4" /> {t("nav.profile")}
                  </Link>

                  <div className="h-px bg-border/50 my-1" />

                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setUserOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/8 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> {t("nav.logout")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login"
                className="hidden sm:flex h-9 px-3 items-center text-sm text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all">
                {t("nav.login")}
              </Link>
              <Link href="/auth/register"
                className="h-9 px-4 flex items-center text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all">
                {t("nav.register")}
              </Link>
            </>
          )}

          <button
            className="sm:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-all"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-background animate-fade-up px-4 py-4 space-y-3 shadow-xl">
          <form onSubmit={search}>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="search" placeholder={t("nav.search")} value={q} onChange={e => setQ(e.target.value)}
                className="w-full h-10 pr-9 pl-3 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </form>
          <nav className="flex flex-col gap-1">
            <Link href="/categories" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors">
              {t("nav.browse")}
            </Link>
            {isFreelancer && (
              <Link href="/dashboard/freelancer" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors">
                {t("nav.myServices")}
              </Link>
            )}
            {isClient && (
              <Link href="/sell" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors">
                {t("nav.sell")}
              </Link>
            )}
            {!session && (
              <>
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm hover:bg-secondary transition-colors">
                  {t("nav.login")}
                </Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-xl text-sm text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  {t("nav.register")}
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
