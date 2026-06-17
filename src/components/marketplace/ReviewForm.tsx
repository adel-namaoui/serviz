"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function ReviewForm({ orderId, serviceId }: { orderId: string; serviceId: string }) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!rating) { setError("اختر تقييماً من 1 إلى 5 نجوم"); return }
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, serviceId, rating, comment }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? "فشل إرسال التقييم"); return }
      setDone(true)
      router.refresh()
    } catch { setError("تعذّر الاتصال بالخادم") }
    finally { setLoading(false) }
  }

  if (done) return (
    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" /> شكراً! تم إرسال تقييمك بنجاح
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-3">
      {/* Stars */}
      <div className="flex items-center gap-1">
        {[1,2,3,4,5].map(n => (
          <button key={n} type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className="transition-transform hover:scale-110 active:scale-95">
            <Star className={cn("h-7 w-7 transition-colors",
              n <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-border hover:text-yellow-300"
            )} />
          </button>
        ))}
        {rating > 0 && (
          <span className="text-xs text-muted-foreground ms-2">
            {["","ضعيف","مقبول","جيد","جيد جداً","ممتاز"][rating]}
          </span>
        )}
      </div>

      <textarea value={comment} onChange={e => setComment(e.target.value)}
        placeholder="أضف تعليقاً (اختياري)..." rows={2}
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none placeholder:text-muted-foreground/60" />

      {error && <p className="text-xs text-destructive">{error}</p>}

      <button type="submit" disabled={loading || !rating}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-40 active:scale-[0.97] transition-all">
        {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        إرسال التقييم
      </button>
    </form>
  )
}