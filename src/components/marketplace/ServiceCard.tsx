"use client"
import Link from "next/link"
import { Star, Clock } from "lucide-react"
import { cn, formatPrice } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useTranslation } from "@/lib/locale-context"

interface Props {
  id: string; 
  title: string; 
  titleAr?: string|null; 
  sellerName: string;
  sellerId: string; // <-- AJOUTÉ
  rating: number; 
  reviewCount: number; 
  price: number; 
  deliveryDays: number; 
  images: string[]
}

export function ServiceCard({ id, title, titleAr, sellerName, sellerId, rating, reviewCount, price, deliveryDays, images }: Props) {
  const { data: session } = useSession()
  const { t, locale } = useTranslation()
  
  const role = (session?.user as any)?.role
  const isFreelancer = role === "FREELANCER"
  const displayTitle = locale === "ar" ? (titleAr || title) : title

  return (
    <div className="group bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/40 hover:shadow-xl transition-all duration-200 relative">
      {/* Lien sur toute la carte vers le service */}
      <Link href={`/service/${id}`} className="absolute inset-0 z-0" />

      <div className="h-40 bg-secondary relative overflow-hidden shrink-0">
        {images?.[0]
          ? <img src={images[0]} alt={displayTitle} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-muted-foreground/8 select-none italic">BrandDZ</div>
        }
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1 z-10 pointer-events-none">
        {/* Vendeur - On rend le nom cliquable vers son profil public */}
        <div className="flex items-center gap-2 min-w-0 pointer-events-auto">
          <div className="h-6 w-6 rounded-full bg-primary/15 flex items-center justify-center text-[10px] font-bold text-primary shrink-0">
            {sellerName[0]?.toUpperCase()}
          </div>
          <Link href={`/freelancer/${sellerId}`} className="text-xs text-muted-foreground truncate font-medium hover:text-primary transition-colors">
            {sellerName}
          </Link>
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
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />{deliveryDays}{t("card.days")} 
          </span>
          <div className="text-end">
            <span className="text-[10px] text-muted-foreground block leading-none">{t("card.startingFrom")}</span>
            <span className="text-sm font-bold text-primary">{formatPrice(price)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}