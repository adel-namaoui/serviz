"use client"
import Link from "next/link"
import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "@/lib/locale-context" // IMPORTÉ

function LoginForm() {
  const { t } = useTranslation() // UTILISÉ
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const sp = useSearchParams()
  const from = sp.get("from") ?? "/dashboard" 

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    try {
      const result: any = await signIn("credentials", { 
        email: email.trim(), 
        password, 
        callbackUrl: from,
      })
      if (result?.error) {
        setError(t("auth.error.invalid"))
        setLoading(false)
      }
    } catch (err) {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-black inline-block mb-3 tracking-tighter italic">
            <span>Brand</span><span className="text-primary">DZ</span>
          </Link>
          <h1 className="text-2xl font-bold">{t("auth.loginTitle")}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t("auth.loginSubtitle")}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/5">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium block">{t("auth.email")}</label>
              <input 
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full h-11 px-4 rounded-xl text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/20 transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium block">{t("auth.password")}</label>
              <div className="relative">
                <input 
                  type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full h-11 px-4 pl-10 rounded-xl text-sm bg-secondary border border-border focus:ring-2 focus:ring-primary/20 transition-all" 
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-destructive text-center py-2 bg-destructive/10 rounded-xl border border-destructive/20">{error}</p>}

            <button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />} {t("auth.login")}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("auth.noAccount")} <Link href="/auth/register" className="text-primary hover:underline font-bold">{t("auth.register")}</Link>
          </p>

          <div className="mt-8 pt-6 border-t border-border/50">
            <p className="text-[10px] font-bold text-muted-foreground uppercase text-center mb-3">{t("auth.demoAccounts")}</p>
            <div className="bg-secondary/50 p-4 rounded-2xl text-[11px] space-y-1 border border-border/50">
              <p>👤 <span className="font-bold">{t("admin.role.client")}:</span> client@branddz.dz / client123</p>
              <p>🎨 <span className="font-bold">{t("admin.role.freelancer")}:</span> karim@branddz.dz / pass123</p>
              <p>⚙️ <span className="font-bold">{t("admin.role.admin")}:</span> admin@branddz.dz / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}