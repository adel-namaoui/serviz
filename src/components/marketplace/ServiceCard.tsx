import Link from "next/link"
import { Star, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export function ServiceCard({ id, title, titleAr, sellerName, rating, reviewCount, price, deliveryDays, images }: {
  id: string; title: string; titleAr?: string|null; sellerName: string
  rating: number; reviewCount: number; price: number; deliveryDays: number; images: string[]
}) {
  const displayTitle = titleAr || title
  return (
    <Link href={`/service/${id}`}>
      <article className={cn(
        "group bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col",
        "hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
      )}>
        {/* Container Image / Placeholder 3D */}
        <div className="h-44 bg-slate-950 relative overflow-hidden shrink-0 flex items-center justify-center border-b border-border/50">
          {images?.[0] ? (
            <img 
              src={images[0]} 
              alt={displayTitle} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          ) : (
            <div className="relative flex items-center justify-center w-full h-full bg-[radial-gradient(circle_at_center,_#1e293b_0%,_#020617_100%)]">
              {/* Grille de fond style perspective */}
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              
              {/* Logo flottant en 3D */}
              <div className="relative transform-gpu transition-all duration-500 group-hover:scale-110 group-hover:-rotate-2 group-hover:-translate-y-3">
                <span className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] italic">
                  Brand<span className="text-primary">DZ</span>
                </span>
                
                {/* Ombre au sol qui réagit au survol */}
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-16 h-2 bg-black/40 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              {/* Reflet brillant (Shimmer) qui traverse au survol */}
              <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
              </div>
            </div>
          )}
        </div>

        {/* Détails du service */}
        <div className="p-4 flex flex-col gap-2.5 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
              {sellerName[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-muted-foreground truncate font-medium">{sellerName}</span>
          </div>
          <p className="text-sm font-semibold leading-snug line-clamp-2 flex-1 group-hover:text-primary transition-colors">{displayTitle}</p>
          
          <div className="flex items-center gap-1.5">
            {reviewCount > 0 ? (
              <>
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold">{rating.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground">({reviewCount})</span>
              </>
            ) : (
              <span className="text-[10px] text-muted-foreground italic">جديد</span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/50 mt-auto">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{deliveryDays}j</span>
            </div>
            <div className="text-end">
              <span className="text-[10px] text-muted-foreground block leading-none mb-0.5">بداية من</span>
              <span className="text-base font-bold text-primary">${price}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}