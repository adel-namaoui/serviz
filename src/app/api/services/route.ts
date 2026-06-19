import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subCategoryId = searchParams.get("subCategoryId")
  const q            = searchParams.get("q")
  // Fix 1: Pagination support
  const page  = Math.max(1, Number(searchParams.get("page")  ?? 1))
  const limit = Math.min(48, Math.max(1, Number(searchParams.get("limit") ?? 12)))
  const skip  = (page - 1) * limit

  const where = {
    isActive: true,
    ...(subCategoryId && { subCategoryId }),
    ...(q && {
      OR: [
        { title:   { contains: q, mode: "insensitive" as const } },
        { titleAr: { contains: q, mode: "insensitive" as const } },
      ],
    }),
  }

  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      include: {
        seller:   { select: { id: true, name: true } },
        packages: { orderBy: { price: "asc" }, take: 1 },
      },
      orderBy: { reviewCount: "desc" },
      take: limit,
      skip,
    }),
    prisma.service.count({ where }),
  ])

  return NextResponse.json({
    services,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}