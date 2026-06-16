import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ChevronLeft } from "lucide-react"
import { ServiceCard } from "@/components/marketplace/ServiceCard"
import { cn } from "@/lib/utils"

// Notez le type Promise pour params
export default async function SubCategoryPage({ 
  params 
}: { 
  params: Promise<{ categoryId: string; subCategoryId: string }> 
}) {
  // On attend les paramètres (Obligatoire en Next.js 15)
  const { categoryId, subCategoryId } = await params;

  const cat = await prisma.category.findUnique({ where: { slug: categoryId } })
  if (!cat) notFound()

  const sub = await prisma.subCategory.findUnique({
    where: { categoryId_slug: { categoryId: cat.id, slug: subCategoryId } },
    include: {
      services: {
        where: { isActive: true },
        include: { seller: { select: { name: true } }, packages: { orderBy: { price: "asc" }, take: 1 } },
        orderBy: { reviewCount: "desc" },
      },
    },
  })
  if (!sub) notFound()

  const allSubs = await prisma.subCategory.findMany({ 
    where: { categoryId: cat.id }, 
    orderBy: { order: "asc" }, 
    select: { id: true, nameAr: true, slug: true } 
  })

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3 flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
            <Link href={`/categories/${cat.slug}`} className="hover:text-foreground transition-colors">{cat.nameAr}</Link>
            <ChevronLeft className="h-3.5 w-3.5 shrink-0" />
            <span className="text-foreground font-medium">{sub.nameAr}</span>
          </nav>
          <h1 className="text-xl font-bold">خدمات {sub.nameAr}</h1>
        </div>
      </div>

      <div className="container py-8 flex gap-6">
        <aside className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-24 space-y-0.5">
            {allSubs.map(s => (
              <Link key={s.id} href={`/categories/${cat.slug}/${s.slug}`}
                className={cn("block px-3 py-2 rounded-lg text-sm transition-colors",
                  s.id === sub.id ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:text-foreground hover:bg-secondary")}>
                {s.nameAr}
              </Link>
            ))}
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground mb-6">{sub.services.length} خدمة متاحة</p>
          {sub.services.length === 0
            ? <div className="text-center py-20"><div className="text-5xl mb-4">📭</div><h3 className="font-semibold text-lg mb-1">لا توجد خدمات بعد</h3><p className="text-muted-foreground text-sm">سيتم إضافة خدمات قريباً</p></div>
            : <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {sub.services.map(s => (
                  <ServiceCard key={s.id} id={s.id} title={s.title} titleAr={s.titleAr || ""}
                    sellerName={s.seller.name} rating={s.rating} reviewCount={s.reviewCount}
                    price={s.packages[0]?.price ?? s.price} deliveryDays={s.deliveryDays} images={s.images} />
                ))}
              </div>
          }
        </div>
      </div>
    </div>
  )
}
