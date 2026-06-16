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
        "hover:border-primary/40 hover:shadow-xl hover:shadow-black/8 transition-all duration-200"
      )}>
        <div className="h-40 bg-slate-900 relative overflow-hidden shrink-0 flex items-center justify-center">
          {images?.[0] ? (
            <img 
              src={images[0]} 
              alt={displayTitle} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          ) : (
            <div className="relative flex items-center justify-center w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/20 via-slate-900 to-slate-950">
              {/* Effet de grille 3D en arrière-plan */}
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
              
              {/* Le texte ou logo avec effet de profondeur */}
              <div className="relative transform-gpu transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <span className="text-4xl font-black tracking-tighter text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] italic">
                  Brand<span className="text-primary">DZ</span>
                </span>
                {/* Reflet brillant */}
                <div className="absolute -inset-2 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 skew-x-12 translate-x-full group-hover:animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col gap-2.5 flex-1">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
              {sellerName[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-muted-foreground truncate font-medium">{sellerName}</span>
          </div>
          <p className="text-sm font-medium leading-snug line-clamp-2 flex-1">{displayTitle}</p>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold">{rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({reviewCount})</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2.5 border-t border-border/50 mt-auto">
            <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{deliveryDays}j</span>
            <div className="text-end"><span className="text-[10px] text-muted-foreground block leading-none">بداية من</span><span className="text-sm font-bold text-primary">${price}</span></div>
          </div>
        </div>
      </article>
    </Link>
  )
}
