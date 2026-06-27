"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { useTranslation } from "@/lib/locale-context"
import { Loader2, Save, Lock, Phone, Mail, User } from "lucide-react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // Ici vous appellerez votre API de mise à jour (voir étape 3)
    setTimeout(() => {
      setLoading(false)
      setMessage("تم تحديث البيانات بنجاح")
    }, 1000)
  }

  return (
    <div className="container py-12 max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold italic">Paramètres du compte</h1>

      <form onSubmit={handleSubmit} className="bg-card border border-border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary font-bold border-b border-border pb-2">
            <User className="h-4 w-4"/> 
            <span>Informations Générales</span>
          </div>
          
          <div className="grid gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase px-1">Nom complet</label>
              <input defaultValue={session?.user?.name || ""} className="w-full p-3 rounded-xl border bg-secondary focus:ring-2 focus:ring-primary/20 outline-none" />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase px-1">Email</label>
              <input disabled value={session?.user?.email || ""} className="w-full p-3 rounded-xl border bg-secondary opacity-60 cursor-not-allowed" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-muted-foreground uppercase px-1">Téléphone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input placeholder="05XX XX XX XX" className="w-full p-3 pl-10 rounded-xl border bg-secondary focus:ring-2 focus:ring-primary/20 outline-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 text-primary font-bold border-b border-border pb-2">
            <Lock className="h-4 w-4"/> 
            <span>Sécurité</span>
          </div>
          <input type="password" placeholder="Nouveau mot de passe" className="w-full p-3 rounded-xl border bg-secondary focus:ring-2 focus:ring-primary/20 outline-none" />
        </div>

        {message && <p className="text-sm text-emerald-500 font-medium text-center">{message}</p>}

        <button disabled={loading} className="bg-primary text-white px-6 py-4 rounded-2xl font-bold w-full hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          Enregistrer les modifications
        </button>
      </form>
    </div>
  )
}