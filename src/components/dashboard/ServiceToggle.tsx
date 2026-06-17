"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ToggleLeft, ToggleRight } from "lucide-react"

export function ServiceToggle({ serviceId, initialState }: { serviceId: string, initialState: boolean }) {
  const [active, setActive] = useState(initialState)
  const router = useRouter()

  async function toggle() {
    const res = await fetch(`/api/services/${serviceId}/toggle`, { method: "POST" })
    if (res.ok) {
      setActive(!active)
      router.refresh()
    }
  }

  return (
    <button onClick={toggle} className="flex items-center gap-1.5 text-xs font-medium hover:text-primary transition-colors">
      {active ? (
        <>
          <ToggleRight className="h-5 w-5 text-primary" />
          <span className="text-emerald-600">نشط</span>
        </>
      ) : (
        <>
          <ToggleLeft className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">متوقف</span>
        </>
      )}
    </button>
  )
}