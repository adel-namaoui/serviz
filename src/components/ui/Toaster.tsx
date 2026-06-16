"use client"
import { useEffect, useState } from "react"
type T = { id: string; msg: string; type: "success"|"error"|"info" }
let listeners: ((t: T[]) => void)[] = []
let toasts: T[] = []
export function toast(msg: string, type: T["type"] = "info") {
  const id = Math.random().toString(36).slice(2)
  toasts = [...toasts, { id, msg, type }]
  listeners.forEach(f => f(toasts))
  setTimeout(() => { toasts = toasts.filter(t => t.id !== id); listeners.forEach(f => f(toasts)) }, 4000)
}
export function Toaster() {
  const [ts, setTs] = useState<T[]>([])
  useEffect(() => { listeners.push(setTs); return () => { listeners = listeners.filter(f => f !== setTs) } }, [])
  const colors = { success: "bg-success text-success-foreground", error: "bg-destructive text-destructive-foreground", info: "bg-primary text-primary-foreground" }
  return (
    <div className="fixed bottom-4 end-4 z-[100] flex flex-col gap-2">
      {ts.map(t => <div key={t.id} className={`${colors[t.type]} rounded-xl px-4 py-3 text-sm font-medium shadow-xl animate-fade-up max-w-xs`}>{t.msg}</div>)}
    </div>
  )
}
