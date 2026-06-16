import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ChevronLeft } from "lucide-react"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"

type I = keyof typeof Icons

// Correction Next.js 15 : params est une Promise
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ categoryId: string }> 
}) {
  const { categoryId } = await params // Attendre les paramètres
  const c = await prisma.category.findUnique({ where: { slug: categoryId } })
  return { title: c ? `خدمات ${c.nameAr}` : "الفئات" }
}

// Correction Next.js 15 : params est une Promise
export default async function CategoryPage({ 
  params 
}: { 
  params: Promise<{ categoryId: string }> 
}) {
  const { categoryId } = await params // Attendre les paramètres

  const cat = await prisma.category.findUnique({
    where: { slug: categoryId },
    include: { subCategories: { orderBy: { order: "asc" } } }
  })

  if (!cat || !cat.isActive) notFound()

  if (cat.comingSoon) return (
    <div className="container py-24 text-center">
      <div className="text-6xl mb-4">🚧</div>
      <h1 className="text-2xl font-bold mb-2">{cat.nameAr}</h1>
      <p className="text-muted-foreground mb-6">هذه الفئة قادمة قريباً</p>
      <Link href="/" className="text-primary hover:underline">الرئيسية</Link>
    </div>
  )

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-8">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-3.5 w-3.5" />
            <Link href="/categories" className="hover:text-foreground transition-colors">الخدمات</Link>
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">{cat.nameAr}</span>
          </nav>
          <h1 className="text-2xl font-bold">خدمات {cat.nameAr}</h1>
        </div>
      </div>
      <div className="container py-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {cat.subCategories.map(sub => {
          const Icon = (Icons[(sub.icon ?? "") as I] as React.ElementType) ?? Icons.Folder
          return (
            <Link key={sub.id} href={`/categories/${cat.slug}/${sub.slug}`}>
              <div className={cn("group flex flex-col items-center gap-2.5 p-5 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-150 text-center h-full")}>
                <div className="h-10 w-10 rounded-xl bg-secondary group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-all"><Icon className="h-5 w-5" /></div>
                <p className="font-medium text-sm leading-tight">{sub.nameAr}</p>
                <p className="text-xs text-muted-foreground">{sub.name}</p>
              </div>
            </Link>
          )
        })}
        {cat.subCategories.length === 0 && <div className="col-span-full text-center py-16 text-muted-foreground">لا توجد فئات فرعية بعد</div>}
      </div>
    </div>
  )
}