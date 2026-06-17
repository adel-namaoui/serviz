"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2, ArrowUpCircle } from "lucide-react"
import { cn } from "@/lib/utils"

type User = {
  id: string; name: string; email: string; role: string; createdAt: Date
  _count: { services: number; ordersAsBuyer: number }
}

const roleBadge: Record<string, string> = {
  CLIENT:     "bg-secondary text-muted-foreground border-border",
  FREELANCER: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  ADMIN:      "bg-primary/10 text-primary border-primary/20",
}
const roleLabels: Record<string, string> = { CLIENT: "عميل", FREELANCER: "مستقل", ADMIN: "مدير" }

export function UserTable({ users }: { users: User[] }) {
  const [loading, setLoading] = useState<string | null>(null)
  const router = useRouter()

  async function action(userId: string, type: "promote" | "delete") {
    if (type === "delete" && !confirm("هل أنت متأكد من حذف هذا المستخدم؟")) return
    setLoading(`${type}-${userId}`)
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: type === "delete" ? "DELETE" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: type === "promote" ? JSON.stringify({ role: "FREELANCER" }) : undefined,
      })
      router.refresh()
    } catch { /* ignore */ }
    finally { setLoading(null) }
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Mobile */}
      <div className="md:hidden divide-y divide-border/50">
        {users.map(u => (
          <div key={u.id} className="p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-medium text-sm truncate">{u.name}</p>
                <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0", roleBadge[u.role])}>
                  {roleLabels[u.role]}
                </span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{u._count.ordersAsBuyer} طلب · {u._count.services} خدمة</p>
            </div>
            {u.role !== "ADMIN" && (
              <div className="flex items-center gap-1.5 shrink-0">
                {u.role === "CLIENT" && (
                  <button onClick={() => action(u.id, "promote")} disabled={!!loading}
                    className="h-8 w-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors disabled:opacity-40"
                    title="ترقية إلى مستقل">
                    {loading === `promote-${u.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUpCircle className="h-3.5 w-3.5" />}
                  </button>
                )}
                <button onClick={() => action(u.id, "delete")} disabled={!!loading}
                  className="h-8 w-8 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-40"
                  title="حذف">
                  {loading === `delete-${u.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              {["الاسم","البريد","الدور","الطلبات","الخدمات","تاريخ التسجيل","إجراءات"].map(h => (
                <th key={h} className="px-4 py-3 text-start font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {users.map(u => (
              <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-medium text-sm">{u.name}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold border", roleBadge[u.role])}>
                    {roleLabels[u.role]}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground text-center">{u._count.ordersAsBuyer}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground text-center">{u._count.services}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(u.createdAt).toLocaleDateString("fr-DZ")}
                </td>
                <td className="px-4 py-3">
                  {u.role !== "ADMIN" && (
                    <div className="flex items-center gap-1.5">
                      {u.role === "CLIENT" && (
                        <button onClick={() => action(u.id, "promote")} disabled={!!loading}
                          className="h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors disabled:opacity-40 font-medium whitespace-nowrap">
                          {loading === `promote-${u.id}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowUpCircle className="h-3 w-3" />}
                          ترقية
                        </button>
                      )}
                      <button onClick={() => action(u.id, "delete")} disabled={!!loading}
                        className="h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-40 font-medium">
                        {loading === `delete-${u.id}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                        حذف
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}