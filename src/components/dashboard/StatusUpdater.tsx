"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function StatusUpdater({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function update(newStatus: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/dashboard/orders/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
        headers: { "Content-Type": "application/json" }
      })
      if (res.ok) {
        setStatus(newStatus)
        router.refresh()
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
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
  )
}