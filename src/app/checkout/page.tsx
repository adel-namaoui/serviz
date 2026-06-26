import { notFound, redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import CheckoutClient from "./CheckoutClient"

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ serviceId?: string; packageId?: string }> }) {
  const { serviceId, packageId } = await searchParams
  const session = await auth()
  if (!session?.user) redirect("/auth/login?from=/checkout")
  if (!serviceId) notFound()

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { seller: { select: { name: true } }, subCategory: { include: { category: true } } },
  })
  if (!service) notFound()

  const pkg = packageId ? await prisma.package.findUnique({ where: { id: packageId } }) : null
  
  return (
    <CheckoutClient 
      service={service} 
      packageId={packageId} 
      pkg={pkg}
      price={pkg?.price ?? service.price}
      days={pkg?.deliveryDays ?? service.deliveryDays}
      rev={pkg?.revisions ?? service.revisions}
    />
  )
}