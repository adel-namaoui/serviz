import { prisma } from "@/lib/prisma"
import SearchClient from "./SearchClient"

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: Promise<{ q?: string }> 
}) {
  // ÉTAPE 1 : Attendre les paramètres (Obligatoire en Next.js 15)
  const resolvedParams = await searchParams
  const q = resolvedParams.q?.trim() ?? ""

  console.log("Recherche en cours pour :", q) // Pour vérifier dans votre terminal

  // ÉTAPE 2 : Lancer la recherche uniquement si q n'est pas vide
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

  // ÉTAPE 3 : Envoyer les résultats au composant Client
  return <SearchClient q={q} services={services} categories={categories} />
}