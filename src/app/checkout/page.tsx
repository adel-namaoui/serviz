import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ChevronLeft, Clock, RefreshCw, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { CheckoutForm } from "@/components/marketplace/CheckoutForm"

export const metadata = { title: "تأكيد الطلب" }

// Correction Next.js 15 : searchParams est une Promise
export default async function CheckoutPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ serviceId?: string; packageId?: string }> 
}) {
  // On attend la résolution des paramètres de recherche
  const params = await searchParams
  const serviceId = params.serviceId
  const packageId = params.packageId

  const session = await auth()
  if (!session?.user) redirect("/auth/login?from=/checkout")

  if (!serviceId) notFound()

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { 
      seller: { select: { name: true } }, 
      subCategory: { include: { category: true } } 
    },
  })
  
  if (!service) notFound()

  // Récupération de la version spécifique (package) si demandée
  const pkg = packageId ? await prisma.package.findUnique({ where: { id: packageId } }) : null
  
  const price = pkg?.price ?? service.price
  const days = pkg?.deliveryDays ?? service.deliveryDays
  const rev = pkg?.revisions ?? service.revisions

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground">الرئيسية</Link>
            <ChevronLeft className="h-3.5 w-3.5" />
            <span className="text-foreground font-medium">تأكيد الطلب</span>
          </nav>
          <h1 className="text-xl font-bold">تأكيد الطلب</h1>
        </div>
      </div>

      <div className="container py-8 max-w-3xl grid md:grid-cols-2 gap-8">
        {/* Summary (Résumé) */}
        <div className="space-y-4">
          <h2 className="font-bold">ملخص الطلب</h2>
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">
                {service.subCategory.category.nameAr} / {service.subCategory.nameAr}
              </p>
              <p className="font-semibold text-sm mt-1 leading-snug">
                {service.titleAr ?? service.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">بواسطة {service.seller.name}</p>
            </div>
            
            {pkg && (
              <div className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
                باقة {pkg.name}
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-border pt-3">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{days} أيام تسليم</span>
              <span className="flex items-center gap-1.5"><RefreshCw className="h-4 w-4" />{rev} تعديل</span>
            </div>
            
            <div className="flex items-center justify-between border-t border-border pt-3">
              <span className="text-muted-foreground text-sm">المجموع</span>
              <span className="text-2xl font-bold text-primary">{price} DA</span>
            </div>
          </div>

          {pkg && pkg.features && (
            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="font-semibold text-sm mb-3">يشمل الطلب</p>
              <ul className="space-y-2">
                {(pkg.features as string[]).map((f: string) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Form (Formulaire) */}
        <div>
          <h2 className="font-bold mb-4">تفاصيل الطلب</h2>
          <CheckoutForm serviceId={serviceId} packageId={packageId} price={price} />
        </div>
      </div>
    </div>
  )
}