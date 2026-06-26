export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { prisma } from "@/lib/prisma"
import HomeClient from "./HomeClient"

export default async function HomePage() {
  const [categories, featuredServices] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { order: "asc" } }),
    prisma.service.findMany({
      where: { isActive: true }, take: 8, orderBy: { reviewCount: "desc" },
      include: { seller: { select: { name: true } }, packages: { orderBy: { price: "asc" }, take: 1 } },
    }),
  ])

  return <HomeClient categories={categories} featuredServices={featuredServices} />
}