import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ServiceCard } from "@/components/marketplace/ServiceCard"
import { Search, Star, Shield, Zap, ChevronLeft } from "lucide-react"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"

type IconName = keyof typeof Icons

async function getData() {
  const [categories, featuredServices] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.service.findMany({
      where: { isActive: true }, take: 8, orderBy: { reviewCount: "desc" },
      include: { seller: { select: { name: true } }, packages: { orderBy: { price: "asc" }, take: 1 } },
    }),
  ])
  return { categories, featuredServices }
}

export default async function HomePage() {
  const { categories, featuredServices } = await getData()
  const popular = ["تصميم شعار", "إدارة إنستغرام", "مونتاج فيديو", "موقع ويب", "UGC"]

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_-20%,hsl(174,72%,42%,0.15),transparent)]" />
        <div className="container relative text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/8 text-primary text-xs font-medium mb-6">
            <Star className="h-3 w-3 fill-primary" /> +500 مستقل موثوق في الجزائر
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">
            أكبر سوق للخدمات المصغرة<br /><span className="text-gradient">في الجزائر</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-10">
            اعثر على أفضل المستقلين للتصميم، التسويق، الفيديو، وأكثر — بأسعار تناسب ميزانيتك
          </p>
          {/* Search */}
          <div className="max-w-xl mx-auto">
            <div className="flex gap-2 p-1.5 rounded-2xl bg-card border border-border shadow-xl shadow-black/8">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input type="search" placeholder="ابحث... مثل: تصميم شعار، إدارة إنستغرام"
                  className="w-full h-11 pr-9 pl-4 rounded-xl bg-secondary border-0 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <button className="h-11 px-5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.97] transition-all shrink-0">بحث</button>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-3 text-xs">
              <span className="text-muted-foreground">شائع:</span>
              {popular.map(p => (
                <Link key={p} href={`/search?q=${encodeURIComponent(p)}`}
                  className="px-2.5 py-1 rounded-full bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-all">{p}</Link>
              ))}
            </div>
          </div>
          {/* Trust */}
          <div className="flex items-center justify-center gap-6 mt-10 text-xs text-muted-foreground">
            {[{ i: Star, t: "تقييم 4.9/5" }, { i: Shield, t: "مدفوعات آمنة" }, { i: Zap, t: "+1500 طلب منجز" }].map(({ i: I, t }) => (
              <span key={t} className="flex items-center gap-1.5"><I className="h-3.5 w-3.5 text-primary" />{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────── */}
      <section className="container pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">تصفح حسب الفئة</h2>
            <p className="text-sm text-muted-foreground mt-0.5">اختر ما تحتاجه</p>
          </div>
          <Link href="/categories" className="flex items-center gap-1 text-sm text-primary hover:underline">
            عرض الكل <ChevronLeft className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-2">
          {categories.map(cat => {
            const Icon = (Icons[cat.icon as IconName] as React.ElementType) ?? Icons.Layers
            if (cat.comingSoon) return (
              <div key={cat.id} className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border opacity-40 cursor-not-allowed select-none">
                <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center"><Icon className="h-5 w-5" /></div>
                <span className="text-xs font-medium text-center leading-tight">{cat.nameAr}</span>
                <span className="text-[10px] text-muted-foreground">قريباً</span>
              </div>
            )
            return (
              <Link key={cat.id} href={`/categories/${cat.slug}`}>
                <div className={cn(
                  "group flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border",
                  "hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-150"
                )}>
                  <div className="h-10 w-10 rounded-xl bg-secondary group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-center leading-tight">{cat.nameAr}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ── Featured Services ─────────────────────────────────── */}
      {featuredServices.length > 0 && (
        <section className="container pb-16">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">خدمات مميزة</h2>
              <p className="text-sm text-muted-foreground mt-0.5">الأعلى تقييماً من مستقلينا</p>
            </div>
            <Link href="/categories" className="flex items-center gap-1 text-sm text-primary hover:underline">
              عرض الكل <ChevronLeft className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredServices.map(s => (
              <ServiceCard key={s.id} id={s.id} title={s.title} titleAr={s.titleAr}
                sellerName={s.seller.name} rating={s.rating} reviewCount={s.reviewCount}
                price={s.packages[0]?.price ?? s.price} deliveryDays={s.deliveryDays} images={s.images} />
            ))}
          </div>
        </section>
      )}

      {/* ── Stats ───────────────────────────────────────────── */}
      <section className="border-y border-border/50 bg-card/40">
        <div className="container py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[["500+", "مستقل محترف"], ["2,000+", "خدمة متاحة"], ["1,500+", "عميل سعيد"], ["4.9★", "متوسط التقييم"]].map(([v, l]) => (
            <div key={l}><div className="text-2xl font-bold text-gradient">{v}</div><div className="text-sm text-muted-foreground mt-0.5">{l}</div></div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="container py-16">
        <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-10 md:p-14 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">هل أنت مستقل محترف؟</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto text-sm">انضم إلى مجتمع المستقلين في الجزائر وابدأ في تقديم خدماتك لآلاف العملاء اليوم</p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.97] transition-all text-sm">
            ابدأ البيع الآن — مجاناً
          </Link>
        </div>
      </section>
    </div>
  )
}
