import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? ""
  if (!q) return NextResponse.json({ services: [], categories: [] })
  const [services, categories] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true, OR: [{ title: { contains: q, mode: "insensitive" } }, { titleAr: { contains: q, mode: "insensitive" } }, { tags: { has: q } }] },
      include: { seller: { select: { name: true } }, packages: { take: 1, orderBy: { price: "asc" } } },
      take: 12,
    }),
    prisma.category.findMany({
      where: { OR: [{ name: { contains: q, mode: "insensitive" } }, { nameAr: { contains: q, mode: "insensitive" } }], isActive: true },
    }),
  ])
  return NextResponse.json({ services, categories })
}
