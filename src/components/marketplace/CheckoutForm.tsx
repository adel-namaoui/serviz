"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function CheckoutForm({ serviceId, packageId, price }: { serviceId: string; packageId?: string; price: number }) {
  const [req, setReq] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ serviceId, packageId, requirements: req }) })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? "حدث خطأ"); return }
      router.push(`/orders/${d.id}?success=1`)
    } catch { setError("تعذّر الاتصال بالخادم") }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium block">متطلباتك</label>
        <p className="text-xs text-muted-foreground">أخبر المستقل بكل التفاصيل اللازمة لإتمام الخدمة</p>
        <textarea value={req} onChange={e => setReq(e.target.value)} rows={6} placeholder="مثال: أريد شعار لمطعم اسمه 'ذوق'، اللون المفضل أخضر وذهبي، الأسلوب عصري..."
          className="w-full px-4 py-3 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none placeholder:text-muted-foreground/60 transition-all" />
      </div>
      {error && <p className="text-sm text-destructive text-center">{error}</p>}
      <div className="bg-card border border-border rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">الخدمة</span><span className="font-medium">${price}</span></div>
        <div className="flex justify-between text-sm"><span className="text-muted-foreground">رسوم المنصة</span><span className="text-success font-medium">مجاناً</span></div>
        <div className="flex justify-between font-bold border-t border-border pt-2 mt-1"><span>الإجمالي</span><span className="text-primary text-lg">${price}</span></div>
      </div>
      <button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />} تأكيد الطلب — ${price}
      </button>
      <p className="text-xs text-muted-foreground text-center">بالضغط على تأكيد الطلب، أنت توافق على شروط الاستخدام</p>
    </form>
  )
}
