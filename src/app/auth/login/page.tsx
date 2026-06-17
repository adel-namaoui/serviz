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
  
  // Correction de la redirection : on s'assure d'aller au bon endroit après le login
  const from = sp.get("from") ?? "/dashboard" 

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError("")
    
    // On enlève redirect: false
    // On laisse NextAuth faire une redirection complète (Full Page Reload)
    // C'est ce qui évite que le bouton ne reste bloqué
    await signIn("credentials", { 
      email: email.trim(), 
      password, 
      callbackUrl: from === "/" ? "/dashboard" : from 
    })
  }
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          {/* LOGO MIS À JOUR */}
          <Link href="/" className="text-3xl font-black inline-block mb-3 tracking-tighter">
            <span>Brand</span><span className="text-primary">DZ</span>
          </Link>
          <h1 className="text-2xl font-bold">مرحباً بعودتك</h1>
          <p className="text-muted-foreground text-sm mt-1">سجّل دخولك للمتابعة في BrandDZ</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl shadow-black/5">
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium block">البريد الإلكتروني</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required
                placeholder="name@branddz.dz"
                className="w-full h-11 px-4 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium block">كلمة المرور</label>
              <div className="relative">
                <input 
                  type={showPw ? "text" : "password"} 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required
                  className="w-full h-11 px-4 pl-10 rounded-xl text-sm bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center py-2.5 px-3 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-in">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "تسجيل الدخول"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            ليس لديك حساب؟ <Link href="/auth/register" className="text-primary hover:underline font-bold">إنشاء حساب جديد</Link>
          </p>

          {/* COMPTES DE TEST MIS À JOUR */}
          <div className="mt-8 pt-6 border-t border-border/50 space-y-2">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center mb-3">حسابات تجريبية للبراند</p>
            <div className="grid grid-cols-1 gap-2">
              <div className="bg-secondary/50 p-3 rounded-xl text-[11px] border border-border/50">
                <p>👤 <span className="font-bold">عميل:</span> client@branddz.dz / client123</p>
                <p>🎨 <span className="font-bold">مصمم:</span> karim@branddz.dz / pass123</p>
                <p>⚙️ <span className="font-bold">مدير:</span> admin@branddz.dz / admin123</p>
              </div>
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