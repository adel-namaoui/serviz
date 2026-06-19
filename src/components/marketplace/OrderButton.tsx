"use client"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { cn, formatPrice } from "@/lib/utils"

export function OrderButton({
  serviceId, packageId, price, label = "اطلب الآن"
}: {
  serviceId: string; packageId?: string; price: number; label?: string
}) {
  const { data: session } = useSession()
  const router = useRouter()

  // Fix 2: Freelancers cannot buy — button is hidden
  const role = (session?.user as any)?.role
  if (role === "FREELANCER") return null

  const handle = () => {
    if (!session) { router.push(`/auth/login?from=/service/${serviceId}`); return }
    const p = new URLSearchParams({ serviceId })
    if (packageId) p.set("packageId", packageId)
    router.push(`/checkout?${p}`)
  }

  return (
    <button
      onClick={handle}
      className={cn(
        "w-full mt-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm",
        "hover:bg-primary/90 active:scale-[0.98] transition-all"
      )}
    >
      {/* Fix 9: DZD currency */}
      {label} — {formatPrice(price)}
    </button>
  )
}