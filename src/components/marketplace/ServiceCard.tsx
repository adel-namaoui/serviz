"use client"
import Link from "next/link"
import { Star, Clock } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { useSession } from "next-auth/react"

interface Props {
  id: string; title: string; titleAr?: string|null; sellerName: string
  rating: number; reviewCount: number; price: number; deliveryDays: number; images: string[]
}

export function ServiceCard({ id, title, titleAr, sellerName, rating, reviewCount, price, deliveryDays, images }: Props) {
  const { data: session } = useSession()
  // Fix 2: Freelancers don't see buy CTAs — the card is still clickable to view
  const role = (session?.user as any)?.role
  const isFreelancer = role === "FREELANCER"
  const displayTitle = titleAr || title

  return (
    <Link href={`/service/${id}`}>
      <article className={cn(
        "group bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col",
        "hover:border-primary/40 hover:shadow-xl hover:shadow-black/8 transition-all duration-200"
      )}>
        {/* Fix 1: Use next/image lazy loading */}
        <div className="h-40 bg-secondary relative overflow-hidden shrink-0">
          {images?.[0]
            ? <img
                src={images[0]} alt={displayTitle} loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            : <div className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-muted-foreground/8 select-none">SZ</div>
          }
        </div>

        <div className="p-4 flex flex-col gap-2.5 flex-1">
          {/* Seller */}
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

          {/* Fix 9: DZD currency + Fix 2: role-aware CTA */}
          <div className="flex items-center justify-between pt-2.5 border-t border-border/50 mt-auto">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />{deliveryDays}j
            </span>
            <div className="text-end">
              <span className="text-[10px] text-muted-foreground block leading-none">بداية من</span>
              <span className="text-sm font-bold text-primary">{formatPrice(price)}</span>
            </div>
          </div>

          {/* Fix 2: Show "اطلب الآن" only for clients/guests */}
          {!isFreelancer && (
            <div className="mt-1 py-2 rounded-xl bg-primary/8 border border-primary/20 text-primary text-xs font-semibold text-center opacity-0 group-hover:opacity-100 transition-opacity">
              اطلب الآن ←
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}