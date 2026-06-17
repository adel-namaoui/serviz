import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NewServiceForm } from "@/components/dashboard/NewServiceForm"

export const metadata = { title: "إضافة خدمة جديدة" }

export default async function NewServicePage() {
  const session = await auth()
  if (!session?.user) redirect("/auth/login?from=/dashboard/new-service")
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user || user.role === "CLIENT") redirect("/")

  const categories = await prisma.category.findMany({
    where: { isActive: true, comingSoon: false },
    include: { subCategories: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  })

  return (
    <div>
      <div className="border-b border-border/50 bg-card/30">
        <div className="container py-8">
          <h1 className="text-xl font-bold">إضافة خدمة جديدة</h1>
          <p className="text-sm text-muted-foreground mt-0.5">أضف خدمتك وستظهر فوراً للعملاء</p>
        </div>
      </div>
      <div className="container py-8 max-w-2xl">
        <NewServiceForm categories={categories} />
      </div>
    </div>
  )
}