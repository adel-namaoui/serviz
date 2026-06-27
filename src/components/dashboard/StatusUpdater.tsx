"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, AlertCircle } from "lucide-react" // Ajout d'icône d'erreur

export function StatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null) // FIX #12 : État d'erreur
  const router = useRouter()

  async function update(newStatus: string) {
    setLoading(true)
    setError(null) // Réinitialise l'erreur
    
    try {
      const res = await fetch(`/api/dashboard/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" }
      })

      if (!res.ok) {
        // FIX #12 : Message si le serveur répond une erreur
        setError("فشل تحديث الحالة") 
        return
      }

      setStatus(newStatus)
      router.refresh()
    } catch (e) {
      // FIX #12 : Message si problème de connexion
      setError("خطأ في الاتصال")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        {loading && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
        <select 
          disabled={loading}
          value={status} 
          onChange={(e) => update(e.target.value)}
          className="text-[10px] font-bold border rounded-lg p-1 bg-secondary cursor-pointer disabled:opacity-50"
        >
          <option value="PENDING">انتظار</option>
          <option value="IN_PROGRESS">جارٍ التنفيذ</option>
          <option value="DELIVERED">تم التسليم</option>
          <option value="COMPLETED">مكتمل</option>
          <option value="CANCELLED">ملغي</option>
        </select>
      </div>
      
      {/* FIX #12 : Affichage du message d'erreur sous le sélecteur */}
      {error && (
        <p className="text-[9px] text-destructive flex items-center gap-1 font-medium">
          <AlertCircle className="h-2.5 w-2.5" /> {error}
        </p>
      )}
    </div>
  )
}