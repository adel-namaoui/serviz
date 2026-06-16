import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subCategoryId = searchParams.get("subCategoryId")
  const q = searchParams.get("q")
  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      ...(subCategoryId && { subCategoryId }),
      ...(q && { OR: [{ title: { contains: q, mode: "insensitive" } }, { titleAr: { contains: q, mode: "insensitive" } }] }),
    },
    include: { seller: { select: { id: true, name: true } }, packages: { orderBy: { price: "asc" }, take: 1 } },
    orderBy: { reviewCount: "desc" },
  })
  return NextResponse.json(services)
}
