import { prisma } from "@/lib/prisma"
import CategoriesClient from "./CategoriesClient"

export default async function CategoriesPage() {
  const cats = await prisma.category.findMany({ 
    where: { isActive: true }, 
    orderBy: { order: "asc" } 
  })
  return <CategoriesClient cats={cats} />
}