import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  
  // FIX #13 : Limitation de la longueur de la requête (max 100 caractères)
  const q = (searchParams.get("q")?.trim() ?? "").slice(0, 100)
  
  // FIX #13 : Sécurité - On refuse les recherches trop courtes (moins de 2 lettres)
  if (q.length < 2) {
    return NextResponse.json({ services: [], categories: [] })
  }

  // FIX #13 : Logique de pagination
  const page = Math.max(1, Number(searchParams.get("page") ?? 1))
  const limit = 12
  const skip = (page - 1) * limit

  try {
    const [services, categories] = await Promise.all([
      prisma.service.findMany({
        where: { 
          isActive: true, 
          OR: [
            { title: { contains: q, mode: "insensitive" } }, 
            { titleAr: { contains: q, mode: "insensitive" } }, 
            { tags: { has: q } }
          ] 
        },
        include: { 
          seller: { select: { name: true } }, 
          packages: { take: 1, orderBy: { price: "asc" } } 
        },
        // FIX #13 : Application de la pagination
        skip: skip,
        take: limit,
        orderBy: { reviewCount: "desc" }
      }),
      prisma.category.findMany({
        where: { 
          isActive: true,
          OR: [
            { name: { contains: q, mode: "insensitive" } }, 
            { nameAr: { contains: q, mode: "insensitive" } }
          ] 
        },
        take: 5 // On limite aussi le nombre de catégories suggérées
      }),
    ])

    return NextResponse.json({ 
      services, 
      categories,
      pagination: {
        page,
        limit,
        count: services.length
      }
    })
  } catch (error) {
    console.error("Search API Error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}