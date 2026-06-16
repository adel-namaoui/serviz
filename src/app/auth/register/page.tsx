"use client"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "CLIENT" })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? "حدث خطأ"); setLoading(false); return }
      const login = await signIn("credentials", { email: form.email, password: form.password, redirect: false })
      if (login?.error) { router.push("/auth/login"); return }
      router.push("/")
      router.refresh()
    } catch { setError("حدث خطأ، حاول مجدداً"); setLoading(false) }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold inline-block mb-3"><span>S</span><span className="text-primary">Z</span></Link>
          <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
          <p className="text-muted-foreground text-sm mt-1">انضم إلى مجتمع سيرفيز</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-secondary rounded-xl mb-6">
            {[{ v: "CLIENT", label: "🛒 أبحث عن خدمة" }, { v: "FREELANCER", label: "💼 أقدم خدمات" }].map(r => (
              <button key={r.v} type="button" onClick={() => set("role", r.v)}
                className={cn("py-2.5 rounded-lg text-sm font-medium transition-all",
                  form.role === r.v ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground")}>
                {r.label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            {[
              { k: "name", l: "الاسم الكامل", t: "text", p: "Ahmed Benali", min: 2 },
              { k: "email", l: "البريد الإلكتروني", t: "email", p: "ahmed@email.com" },
              { k: "password", l: "كلمة المرور", t: "password", p: "••••••••", min: 6 },
            ].map(f => (
              <div key={f.k} className="space-y-1.5">
                <label className="text-sm font-medium block">{f.l}</label>
                <input type={f.t} value={(form as any)[f.k]} onChange={e => set(f.k, e.target.value)}
                  placeholder={f.p} required minLength={f.min}
                  className="w-full h-11 px-4 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60" />
              </div>
            ))}

            {error && <p className="text-sm text-destructive text-center py-2 px-3 rounded-xl bg-destructive/8 border border-destructive/20">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} إنشاء الحساب
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            لديك حساب؟ <Link href="/auth/login" className="text-primary hover:underline font-medium">تسجيل الدخول</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
