export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { prisma } from "@/lib/prisma"
import { ServiceCard } from "@/components/marketplace/ServiceCard"
import { Search } from "lucide-react"
import Link from "next/link"

// Correction Next.js 15 : searchParams est une Promise
export async function generateMetadata({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const { q } = await searchParams
  return { title: q ? `بحث: ${q}` : "بحث" }
}

// Correction Next.js 15 : searchParams est une Promise
export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  // On attend la résolution des paramètres de recherche
  const params = await searchParams
  const q = params.q?.trim() ?? ""

  const services = q ? await prisma.service.findMany({
    where: {
      isActive: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { titleAr: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { tags: { has: q } },
      ],
    },
    include: { 
      seller: { select: { name: true } }, 
      packages: { orderBy: { price: "asc" }, take: 1 } 
    },
    orderBy: { reviewCount: "desc" },
    take: 24,
  }) : []

  const categories = q ? await prisma.category.findMany({
    where: { 
      OR: [
        { name: { contains: q, mode: "insensitive" } }, 
        { nameAr: { contains: q, mode: "insensitive" } }
      ], 
      isActive: true, 
      comingSoon: false 
    },
  }) : []

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-8">
          <h1 className="text-xl font-bold">
            {q ? <>نتائج البحث عن: <span className="text-primary">"{q}"</span></> : "البحث"}
          </h1>
          {q && <p className="text-muted-foreground text-sm mt-1">{services.length + categories.length} نتيجة</p>}
        </div>
      </div>

      <div className="container py-8">
        {!q && (
          <div className="text-center py-20">
            <Search className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">اكتب ما تبحث عنه في شريط البحث أعلاه</p>
          </div>
        )}

        {q && services.length === 0 && categories.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-lg font-semibold mb-2">لا توجد نتائج لـ "{q}"</h2>
            <p className="text-muted-foreground text-sm mb-6">جرب كلمات مختلفة أو تصفح الفئات</p>
            <Link href="/categories" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all">
              تصفح الفئات
            </Link>
          </div>
        )}

        {categories.length > 0 && (
          <div className="mb-10">
            <h2 className="font-bold mb-4">الفئات</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <Link key={c.id} href={`/categories/${c.slug}`}
                  className="px-4 py-2 rounded-xl bg-card border border-border hover:border-primary/40 text-sm font-medium transition-all">
                  {c.nameAr} — {c.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {services.length > 0 && (
          <div>
            <h2 className="font-bold mb-4">الخدمات ({services.length})</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {services.map(s => (
                <ServiceCard 
                  key={s.id} 
                  id={s.id} 
                  title={s.title} 
                  titleAr={s.titleAr}
                  sellerName={s.seller.name} 
                  rating={s.rating} 
                  reviewCount={s.reviewCount}
                  price={s.packages[0]?.price ?? s.price} 
                  deliveryDays={s.deliveryDays} 
                  images={s.images} 
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}