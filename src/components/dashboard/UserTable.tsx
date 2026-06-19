"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2, ArrowUpCircle, AlertTriangle, X } from "lucide-react"
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

// Fix 8: Custom confirmation modal — replaces window.confirm
function ConfirmModal({
  user, onConfirm, onCancel, loading,
}: {
  user: User; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      {/* Modal */}
      <div className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fade-up">
        <button onClick={onCancel} className="absolute top-4 end-4 h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary transition-all">
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <p className="font-bold text-sm">حذف المستخدم</p>
            <p className="text-xs text-muted-foreground mt-0.5">هذا الإجراء لا يمكن التراجع عنه</p>
          </div>
        </div>

        <div className="bg-secondary rounded-xl p-3 mb-5">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {user._count.ordersAsBuyer} طلب · {user._count.services} خدمة · {roleLabels[user.role]}
          </p>
        </div>

        <div className="flex gap-2">
          <button onClick={onCancel}
            className="flex-1 h-10 rounded-xl border border-border hover:bg-secondary text-sm font-medium transition-all">
            إلغاء
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex-1 h-10 rounded-xl bg-destructive text-destructive-foreground text-sm font-semibold hover:bg-destructive/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            حذف المستخدم
          </button>
        </div>
      </div>
    </div>
  )
}

export function UserTable({ users }: { users: User[] }) {
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null)
  const router = useRouter()

  async function promote(userId: string) {
    setActionLoading(`promote-${userId}`)
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "FREELANCER" }),
    })
    router.refresh()
    setActionLoading(null)
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    setActionLoading(`delete-${deleteTarget.id}`)
    await fetch(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" })
    setDeleteTarget(null)
    router.refresh()
    setActionLoading(null)
  }

  return (
    <>
      {/* Fix 8: Custom modal replaces window.confirm */}
      {deleteTarget && (
        <ConfirmModal
          user={deleteTarget}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={!!actionLoading?.startsWith("delete")}
        />
      )}

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
              </div>
              {u.role !== "ADMIN" && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {u.role === "CLIENT" && (
                    <button onClick={() => promote(u.id)} disabled={!!actionLoading}
                      className="h-8 w-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors disabled:opacity-40">
                      {actionLoading === `promote-${u.id}` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ArrowUpCircle className="h-3.5 w-3.5" />}
                    </button>
                  )}
                  <button onClick={() => setDeleteTarget(u)} disabled={!!actionLoading}
                    className="h-8 w-8 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-40">
                    <Trash2 className="h-3.5 w-3.5" />
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
                          <button onClick={() => promote(u.id)} disabled={!!actionLoading}
                            className="h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-xs bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors disabled:opacity-40 font-medium whitespace-nowrap">
                            {actionLoading === `promote-${u.id}` ? <Loader2 className="h-3 w-3 animate-spin" /> : <ArrowUpCircle className="h-3 w-3" />}
                            ترقية
                          </button>
                        )}
                        <button onClick={() => setDeleteTarget(u)} disabled={!!actionLoading}
                          className="h-7 px-2.5 rounded-lg flex items-center gap-1.5 text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors disabled:opacity-40 font-medium">
                          <Trash2 className="h-3 w-3" /> حذف
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
    </>
  )
}