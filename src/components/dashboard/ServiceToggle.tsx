"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"

interface ServiceToggleProps {
  serviceId: string
  initialState: boolean
}

export function ServiceToggle({
  serviceId,
  initialState,
}: ServiceToggleProps) {
  const [isActive, setIsActive] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function toggle() {
    if (loading) return

    const previous = isActive

    setIsActive(!previous)
    setLoading(true)

    try {
      const res = await fetch(`/api/services/${serviceId}/toggle`, {
        method: "PATCH",
      })

      if (!res.ok) {
        setIsActive(previous)
        return
      }

      const updated = await res.json()

      if (typeof updated.isActive === "boolean") {
        setIsActive(updated.isActive)
      }

      router.refresh()
    } catch (error) {
      console.error(error)
      setIsActive(previous)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-full
        text-xs font-bold backdrop-blur-md
        border transition-all duration-300
        ${isActive
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          : "bg-red-500/20 text-red-300 border-red-500/40"}
      `}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isActive ? (
        <>
          <EyeOff className="h-4 w-4" />
          إخفاء
        </>
      ) : (
        <>
          <Eye className="h-4 w-4" />
          إظهار
        </>
      )}
    </button>
  )
}