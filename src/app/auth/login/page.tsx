"use client"
import Link from "next/link"
import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sp = useSearchParams()
  const from = sp.get("from") ?? "/"

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    const res = await signIn("credentials", { email, password, redirect: false })
    if (res?.error) { setError("البريد الإلكتروني أو كلمة المرور غير صحيحة"); setLoading(false); return }
    router.push(from); router.refresh()
  }

  const field = (label: string, type: string, val: string, set: (v: string) => void, extra?: React.ReactNode) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium block">{label}</label>
      <div className="relative">
        <input type={type} value={val} onChange={e => set(e.target.value)} required
          autoComplete={type === "password" ? "current-password" : "email"}
          className={cn("w-full h-11 px-4 rounded-xl text-sm bg-secondary border border-border",
            "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
            extra && "pl-10")} />
        {extra}
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold inline-block mb-3"><span>S</span><span className="text-primary">Z</span></Link>
          <h1 className="text-2xl font-bold">مرحباً بعودتك</h1>
          <p className="text-muted-foreground text-sm mt-1">سجّل دخولك للمتابعة</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          <form onSubmit={submit} className="space-y-4">
            {field("البريد الإلكتروني", "email", email, setEmail)}
            <div className="space-y-1.5">
              <label className="text-sm font-medium block">كلمة المرور</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  autoComplete="current-password"
                  className="w-full h-11 px-4 pl-10 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-destructive text-center py-2 px-3 rounded-xl bg-destructive/8 border border-destructive/20">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} تسجيل الدخول
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ليس لديك حساب؟ <Link href="/auth/register" className="text-primary hover:underline font-medium">إنشاء حساب</Link>
          </p>

          <div className="mt-6 pt-5 border-t border-border/50 rounded-xl bg-secondary/50 p-4 -mx-0 text-xs text-muted-foreground space-y-1">
            <p className="font-semibold text-foreground/70 mb-2">حسابات تجريبية:</p>
            <p>👤 عميل: client@serviz.dz / client123</p>
            <p>🎨 مصمم: karim@serviz.dz / pass123</p>
            <p>📢 تسويق: sara@serviz.dz / pass123</p>
            <p>⚙️ مدير: admin@serviz.dz / admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
