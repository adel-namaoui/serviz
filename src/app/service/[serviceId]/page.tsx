import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ChevronLeft, Star, Clock, RefreshCw, CheckCircle2 } from "lucide-react"
import { OrderButton } from "@/components/marketplace/OrderButton"

// Optionnel: Ajoutez generateMetadata pour le SEO
export async function generateMetadata({ params }: { params: Promise<{ serviceId: string }> }) {
  const { serviceId } = await params
  const s = await prisma.service.findUnique({ where: { id: serviceId } })
  return { title: s ? s.titleAr || s.title : "الخدمة" }
}

export default async function ServicePage({ 
  params 
}: { 
  params: Promise<{ serviceId: string }> 
}) {
  // Correction Next.js 15
  const { serviceId } = await params

  const s = await prisma.service.findUnique({
    where: { id: serviceId },
    include: {
      seller: { select: { id: true, name: true, bio: true, image: true } },
      subCategory: { include: { category: true } },
      packages: { orderBy: { price: "asc" } },
    },
  })

  if (!s || !s.isActive) notFound()

  const pkg = s.packages[0]

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground">الرئيسية</Link>
            <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
            <Link href={`/categories/${s.subCategory.category.slug}`} className="hover:text-foreground">{s.subCategory.category.nameAr}</Link>
            <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
            <Link href={`/categories/${s.subCategory.category.slug}/${s.subCategory.slug}`} className="hover:text-foreground">{s.subCategory.nameAr}</Link>
          </nav>
        </div>
      </div>

      <div className="container py-8 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-xl font-bold leading-snug">{s.titleAr ?? s.title}</h1>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center font-bold text-primary text-sm">{s.seller.name[0]}</div>
            <div>
              <p className="font-semibold text-sm">{s.seller.name}</p>
              {s.reviewCount > 0 && (
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{s.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({s.reviewCount} تقييم)</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden bg-secondary aspect-video flex items-center justify-center">
            {s.images?.[0]
              ? <img src={s.images[0]} alt={s.title} className="w-full h-full object-cover" />
              : <span className="text-8xl font-bold text-muted-foreground/8 select-none">SZ</span>
            }
          </div>

          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="font-bold mb-3">عن الخدمة</h2>
            <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{s.description}</p>
          </div>

          {s.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {s.tags.map(t => (
                <Link key={t} href={`/search?q=${t}`} className="px-3 py-1 rounded-full bg-secondary hover:bg-muted text-sm text-muted-foreground hover:text-foreground transition-all">#{t}</Link>
              ))}
            </div>
          )}

          {s.packages.length > 1 && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="grid" style={{ gridTemplateColumns: `repeat(${s.packages.length},1fr)` }}>
                {s.packages.map((p, i) => (
                  <div key={p.id} className={`p-4 border-b border-border ${i < s.packages.length - 1 ? "border-e" : ""}`}>
                    <p className="font-bold text-sm">{p.name}</p>
                    <p className="text-xl font-bold text-primary mt-1">${p.price}</p>
                    <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{p.description}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.deliveryDays}j</span>
                      <span className="flex items-center gap-1"><RefreshCw className="h-3 w-3" />{p.revisions} révision</span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {p.features.map(f => <li key={f} className="flex items-start gap-1.5 text-xs"><CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />{f}</li>)}
                    </ul>
                    <OrderButton serviceId={s.id} packageId={p.id} price={p.price} label={`Choisir ${p.name}`} />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-card rounded-2xl p-6 border border-border">
            <h2 className="font-bold mb-4">عن المستقل</h2>
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/15 flex items-center justify-center text-xl font-bold text-primary shrink-0">{s.seller.name[0]}</div>
              <div>
                <p className="font-semibold">{s.seller.name}</p>
                <p className="text-muted-foreground text-sm mt-1">{s.seller.bio ?? "مستقل محترف على سيرفيز"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">بداية من</p>
                <p className="text-3xl font-bold text-primary">${pkg?.price ?? s.price}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground py-3 border-y border-border/50">
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{pkg?.deliveryDays ?? s.deliveryDays} أيام تسليم</span>
                <span className="flex items-center gap-1.5"><RefreshCw className="h-4 w-4" />{pkg?.revisions ?? s.revisions} تعديل</span>
              </div>
              {pkg && pkg.features.length > 0 && (
                <ul className="space-y-2">
                  {pkg.features.map(f => <li key={f} className="flex items-start gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />{f}</li>)}
                </ul>
              )}
              <OrderButton serviceId={s.id} packageId={pkg?.id} price={pkg?.price ?? s.price} label="اطلب الآن" />
              {s.packages.length > 1 && <p className="text-xs text-muted-foreground text-center">أو اختر باقة مخصصة أدناه ↓</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}