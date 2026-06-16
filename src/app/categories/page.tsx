import Link from "next/link"
import { prisma } from "@/lib/prisma"
import * as Icons from "lucide-react"
import { cn } from "@/lib/utils"

export const metadata = { title: "تصفح الخدمات" }
type I = keyof typeof Icons

export default async function CategoriesPage() {
  // Correction ici : Suppression de "services: false"
  const cats = await prisma.category.findMany({ 
    where: { isActive: true }, 
    orderBy: { order: "asc" }, 
    include: { 
      _count: { 
        select: { subCategories: true } 
      } 
    } 
  })

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-10 text-center">
          <h1 className="text-3xl font-bold mb-2">جميع الخدمات</h1>
          <p className="text-muted-foreground">اختر الفئة التي تحتاجها</p>
        </div>
      </div>
      <div className="container py-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cats.map(cat => {
          const Icon = (Icons[cat.icon as I] as React.ElementType) ?? Icons.Layers
          if (cat.comingSoon) return (
            <div key={cat.id} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border opacity-40 cursor-not-allowed">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center"><Icon className="h-6 w-6" /></div>
              <div className="text-center"><p className="font-semibold text-sm">{cat.nameAr}</p><p className="text-xs text-muted-foreground mt-0.5">قريباً</p></div>
            </div>
          )
          return (
            <Link key={cat.id} href={`/categories/${cat.slug}`}>
              <div className={cn("group flex flex-col items-center gap-3 p-6 rounded-2xl bg-card border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-150")}>
                <div className="h-12 w-12 rounded-xl bg-secondary group-hover:bg-primary/10 group-hover:text-primary flex items-center justify-center transition-all"><Icon className="h-6 w-6" /></div>
                <div className="text-center">
                  <p className="font-semibold text-sm">{cat.nameAr}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{cat.name}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}