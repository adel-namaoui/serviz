"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { useState, useEffect, useRef } from "react"
import { Search, Sun, Moon, User, LayoutDashboard, ShoppingBag, LogOut, Menu, X, ChevronDown, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
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
    const fn = (e: MouseEvent) => { if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false) }
    document.addEventListener("mousedown", fn)
    return () => document.removeEventListener("mousedown", fn)
  }, [])

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    if (q.trim()) { router.push(`/search?q=${encodeURIComponent(q.trim())}`); setMobileOpen(false) }
  }

  const role = (session?.user as any)?.role

  return (
    <header className={cn("sticky top-0 z-50 w-full transition-all duration-200", scrolled ? "glass shadow-sm" : "bg-background border-b border-border/50")}>
      <div className="container flex h-16 items-center gap-3">
        {/* Logo */}
        <Link href="/" className="shrink-0 font-bold text-2xl tracking-tight select-none">
          <span>S</span><span className="text-primary">Z</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 mx-1">
          <Link href="/categories" className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">تصفح الخدمات</Link>
          {role !== "FREELANCER" && role !== "ADMIN" && (
            <Link href="/sell" className="px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">ابدأ البيع</Link>
          )}
        </nav>

        {/* Search */}
        <form onSubmit={search} className="hidden sm:flex flex-1 max-w-sm lg:max-w-md">
          <div className="relative w-full">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input type="search" placeholder="ابحث عن خدمة..." value={q} onChange={e => setQ(e.target.value)}
              className="w-full h-9 pr-9 pl-3 rounded-xl text-sm bg-secondary border border-border placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
          </div>
        </form>

        {/* Right */}
        <div className="flex items-center gap-1 ml-auto">
          {mounted && (
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all" aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          )}

          {session?.user ? (
            <div ref={userRef} className="relative">
              <button onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 h-9 px-2.5 rounded-xl hover:bg-secondary transition-all border border-transparent hover:border-border">
                <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {session.user.name?.[0]?.toUpperCase() ?? "U"}
                </div>
                <span className="hidden md:inline text-sm font-medium max-w-[90px] truncate">{session.user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
              </button>
              
              {userOpen && (
                <div className="absolute top-full mt-1.5 end-0 w-52 rounded-2xl border border-border bg-popover shadow-xl shadow-black/10 overflow-hidden animate-fade-up z-50 py-1.5">
                  <div className="px-3 py-2 border-b border-border/50 mb-1">
                    <p className="text-xs font-medium text-muted-foreground">مرحباً بك</p>
                    <p className="text-sm font-bold truncate">{session.user.email}</p>
                  </div>

                  {/* LIENS ADMIN */}
                  {role === "ADMIN" && (
                    <Link href="/admin" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors font-semibold">
                      <LayoutDashboard className="h-4 w-4" /> لوحة إدارة المنصة
                    </Link>
                  )}

                  {/* LIENS FREELANCER */}
                  {role === "FREELANCER" && (
                    <Link href="/dashboard/freelancer" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-primary hover:bg-primary/5 transition-colors font-semibold">
                      <BarChart3 className="h-4 w-4" /> طلبات عملائي (المبيعات)
                    </Link>
                  )}

                  {/* LIENS CLIENTS / TOUS */}
                  <Link href="/profile/orders" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <ShoppingBag className="h-4 w-4" /> مشترياتي
                  </Link>
                  <Link href="/profile" onClick={() => setUserOpen(false)} className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                    <User className="h-4 w-4" /> ملفي الشخصي
                  </Link>
                  
                  <div className="h-px bg-border/50 my-1" />
                  <button onClick={() => { signOut({ callbackUrl: "/" }); setUserOpen(false) }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/8 transition-colors">
                    <LogOut className="h-4 w-4" /> تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login" className="hidden sm:flex h-9 px-3 items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-all">تسجيل الدخول</Link>
              <Link href="/auth/register" className="h-9 px-5 flex items-center text-sm font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all active:scale-95">ابدأ الآن</Link>
            </div>
          )}

          <button className="sm:hidden h-9 w-9 flex items-center justify-center rounded-lg hover:bg-secondary transition-all" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-border bg-background animate-fade-up px-4 py-6 space-y-4 shadow-2xl">
          <form onSubmit={search}>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="search" placeholder="ابحث عن خدمة..." value={q} onChange={e => setQ(e.target.value)}
                className="w-full h-11 pr-10 pl-4 rounded-xl text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/20" />
            </div>
          </form>
          <nav className="flex flex-col gap-2">
            <Link href="/categories" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-medium hover:bg-secondary transition-colors">تصفح الخدمات</Link>
            {session && (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-sm font-bold bg-primary/10 text-primary">لوحة التحكم</Link>
            )}
            {!session && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/auth/login" onClick={() => setMobileOpen(false)} className="flex h-11 items-center justify-center rounded-xl border border-border text-sm font-medium">تسجيل الدخول</Link>
                <Link href="/auth/register" onClick={() => setMobileOpen(false)} className="flex h-11 items-center justify-center rounded-xl bg-primary text-primary-foreground text-sm font-bold">إنشاء حساب</Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}