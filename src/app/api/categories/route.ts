import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const cats = await prisma.category.findMany({
    where: { isActive: true }, orderBy: { order: "asc" },
    include: { subCategories: { orderBy: { order: "asc" } } },
  })
  return NextResponse.json(cats)
}
