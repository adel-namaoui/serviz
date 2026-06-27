import { redirect } from "next/navigation"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DollarSign, Package, ShoppingBag, Plus, Clock, Star, Eye, ChevronLeft, LayoutGrid, Zap } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils" 
import { ServiceToggle } from "@/components/dashboard/ServiceToggle"

export const metadata = { title: "لوحة التحكم - خدماتي | BrandDZ" }

export default async function FreelancerDashboard() {
  const session = await auth()
  if (!session?.user?.id) redirect("/auth/login")
  
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role === "CLIENT") redirect("/")

  const [totalOrders, pendingCount, earningsResult, services] = await Promise.all([
    prisma.order.count({ where: { service: { sellerId: user.id } } }),
    prisma.order.count({ where: { service: { sellerId: user.id }, status: { in: ["PENDING", "IN_PROGRESS", "REVISION"] } } }),
    prisma.order.aggregate({
      where: { service: { sellerId: user.id }, status: { in: ["DELIVERED", "COMPLETED"] } },
      _sum: { totalPrice: true },
    }),
    prisma.service.findMany({
      where: { sellerId: user.id },
      include: { 
        subCategory: { include: { category: true } }, 
        _count: { select: { orders: true } } 
      },
      orderBy: { createdAt: "desc" },
    }),
  ])

  const stats = [
    { icon: ShoppingBag, label: "إجمالي الطلبات", value: totalOrders, color: "text-blue-500 bg-blue-500/10" },
    { icon: Zap, label: "طلبات نشطة", value: pendingCount, color: "text-amber-500 bg-amber-500/10" },
    { icon: LayoutGrid, label: "خدماتي", value: services.length, color: "text-purple-500 bg-purple-500/10" },
    { icon: DollarSign, label: "أرباحي", value: formatPrice(earningsResult._sum.totalPrice ?? 0), color: "text-emerald-500 bg-emerald-500/10" },
  ]

  return (
    <div className="container py-10 space-y-10 max-w-6xl">
      {/* Header Section */}
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight italic">BrandDZ <span className="text-primary not-italic">Dashboard</span></h1>
          <p className="text-muted-foreground text-sm font-medium">مرحباً {user.name}، إليك ملخص نشاطك التجاري</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/sales" className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border font-bold text-sm hover:bg-secondary transition-all shadow-sm">
            إدارة المبيعات <ChevronLeft className="h-4 w-4" />
          </Link>
          <Link href="/dashboard/new-service" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">
            <Plus className="h-5 w-5" /> إضافة خدمة
          </Link>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mb-4 shadow-inner", s.color)}>
              <s.icon className="h-6 w-6" />
            </div>
            <div className="space-y-0.5">
               <p className="text-2xl font-black tracking-tight">{s.value}</p>
               <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Services Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <h2 className="text-xl font-bold flex items-center gap-2">
             <Package className="h-5 w-5 text-primary" /> خدماتي المعروضة
           </h2>
           <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1 rounded-full">
             {services.length} خدمة
           </span>
        </div>

        {services.length === 0 ? (
          <div className="bg-card border-2 border-dashed border-border rounded-[3rem] p-20 text-center space-y-4">
            <div className="h-20 w-20 bg-secondary rounded-full flex items-center justify-center mx-auto opacity-30">
               <Plus className="h-10 w-10" />
            </div>
            <p className="text-muted-foreground font-medium">ابدأ الآن وأضف خدمتك الأولى على المنصة!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(svc => (
              <div
                key={svc.id}
                className={`group rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-300 flex flex-col
                ${
                  svc.isActive
                    ? "bg-card border border-border hover:border-primary/40 hover:shadow-xl"
                    : "bg-card/50 border border-red-500/20 opacity-75"
                }`}
              >
                {/* Image / Status Overlay */}
                <div className="h-48 bg-slate-900 relative overflow-hidden">
                  {svc.images?.[0] 
                    ? <img
                        src={svc.images[0]}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          svc.isActive
                            ? "group-hover:scale-110"
                            : "grayscale opacity-60"
                        }`}
                        alt=""
                      />
                    : <div className="w-full h-full flex items-center justify-center text-4xl font-black text-white/5 italic">BrandDZ</div>
                  }
                  <div className="absolute top-4 left-4 z-20">
                    <ServiceToggle
                      serviceId={svc.id}
                      initialState={svc.isActive}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-primary uppercase tracking-widest">
                      {svc.subCategory.nameAr}
                    </p>
                  <div
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold w-fit ${
                      svc.isActive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/15 text-red-400 border border-red-500/20"
                    }`}
                  >
                    <span className="text-[8px]">●</span>
                    {svc.isActive ? "نشطة" : "مخفية"}
                  </div>
                    <h3 className="font-bold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                      {svc.titleAr ?? svc.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 py-3 border-y border-border/50">
                    <div className="flex items-center gap-1.5">
                       <ShoppingBag className="h-3.5 w-3.5 text-muted-foreground" />
                       <span className="text-xs font-bold">{svc._count.orders} طلبات</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                       <span className="text-xs font-bold">{svc.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-auto">
                    <div className="flex flex-col">
                       <span className="text-[10px] text-muted-foreground font-bold uppercase">السعر الأساسي</span>
                       <span className="text-xl font-black text-primary">{formatPrice(svc.price)}</span>
                    </div>
                    <Link 
                      href={`/service/${svc.id}`}
                      className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                      <Eye className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}