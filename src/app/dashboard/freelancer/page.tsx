import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export default async function FreelancerDashboard() {
  const session = await auth()
  if (session?.user.role !== "FREELANCER") redirect("/")

  // On récupère les commandes pour ses services
  const ordersReceived = await prisma.order.findMany({
    where: { service: { sellerId: session.user.id } },
    include: {
      buyer: { select: { name: true, email: true } },
      service: { select: { titleAr: true, price: true } }
    },
    orderBy: { createdAt: "desc" }
  })

  return (
    <div className="container py-10">
      <h1 className="text-2xl font-bold mb-6">طلبات عملائي (Espace Freelancer)</h1>
      
      <div className="grid gap-4">
        {ordersReceived.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-3xl">
            <p className="text-muted-foreground">لا توجد طلبات جديدة حالياً.</p>
          </div>
        ) : (
          ordersReceived.map((order) => (
            <div key={order.id} className="p-6 border rounded-2xl bg-card flex justify-between items-center">
              <div>
                <p className="font-bold text-primary">{order.service.titleAr}</p>
                <p className="text-sm">العميل: {order.buyer.name}</p>
                <p className="text-xs text-muted-foreground">{order.buyer.email}</p>
              </div>
              <div className="text-left">
                <p className="text-xl font-bold">${order.totalPrice}</p>
                <span className="text-xs bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded">
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}