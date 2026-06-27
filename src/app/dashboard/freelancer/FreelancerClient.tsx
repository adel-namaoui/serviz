"use client"
import { useTranslation } from "@/lib/locale-context"
import Link from "next/link"
import { DollarSign, Package, ShoppingBag, Plus, Star, Eye, ChevronLeft, LayoutGrid, Zap } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils" 
import { ServiceToggle } from "@/components/dashboard/ServiceToggle"

// Map pour transformer le texte en composant icône
const IconMap: any = { ShoppingBag, Zap, LayoutGrid, DollarSign }

export default function FreelancerClient({ stats, services, userName }: any) {
  const { t, locale } = useTranslation()

  return (
    <div className="container py-10 space-y-10 max-w-6xl">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight italic">BrandDZ <span className="text-primary not-italic">Dashboard</span></h1>
          <p className="text-muted-foreground text-sm font-medium">{t("dash.freelancer.subtitle")} - {userName}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/sales" className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border font-bold text-sm hover:bg-secondary transition-all shadow-sm">
            {t("dash.incomingOrders")} <ChevronLeft className={cn("h-4 w-4", locale !== 'ar' && "rotate-180")} />
          </Link>
          <Link href="/dashboard/new-service" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" /> {t("dash.addService")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s: any) => {
          const Icon = IconMap[s.iconName] // On récupère l'icône ici
          return (
            <div key={s.label} className="bg-card border border-border rounded-[2rem] p-6 shadow-sm">
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner", s.color)}>
                <Icon className="h-6 w-6" />
              </div>
              <p className="text-2xl font-black tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{t(s.label as any)}</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" /> {t("dash.myServices")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc: any) => (
            <div key={svc.id} className="group bg-card border border-border rounded-[2.5rem] overflow-hidden flex flex-col">
              <div className="h-48 bg-slate-900 relative overflow-hidden">
                {svc.images?.[0] ? <img src={svc.images[0]} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/5 italic">BrandDZ</div>}
                <div className="absolute top-4 left-4 z-20">
                  <ServiceToggle serviceId={svc.id} initialState={svc.isActive} />
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col space-y-4">
                <p className="text-[10px] font-bold text-primary uppercase">{locale === 'ar' ? svc.subCategory.nameAr : svc.subCategory.name}</p>
                <h3 className="font-bold text-base line-clamp-2">{locale === 'ar' ? (svc.titleAr || svc.title) : svc.title}</h3>
                <div className="flex items-center justify-between pt-2 mt-auto">
                  <div className="flex flex-col">
                     <span className="text-[10px] text-muted-foreground font-bold uppercase">{t("newService.price")}</span>
                     <span className="text-xl font-black text-primary">{formatPrice(svc.price)}</span>
                  </div>
                  <Link href={`/service/${svc.id}`} className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                    <Eye className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}