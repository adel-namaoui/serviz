import { prisma } from "@/lib/prisma"
import SearchClient from "./SearchClient"

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  const resolvedParams = await searchParams
  const q = resolvedParams.q?.trim() ?? ""

  // FIX #15 : Suppression du console.log inutile en production

  const services = q ? await prisma.service.findMany({
    where: {
      isActive: true,
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { titleAr: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { tags: { has: q } },
      ],
    },
    include: { 
      seller: { select: { name: true } }, 
      packages: { orderBy: { price: "asc" }, take: 1 } 
    },
    orderBy: { reviewCount: "desc" },
    take: 24,
  }) : []

  const categories = q ? await prisma.category.findMany({
    where: { 
      OR: [
        { name: { contains: q, mode: "insensitive" } }, 
        { nameAr: { contains: q, mode: "insensitive" } }
      ], 
      isActive: true 
    },
  }) : []

  return <SearchClient q={q} services={services} categories={categories} />
}