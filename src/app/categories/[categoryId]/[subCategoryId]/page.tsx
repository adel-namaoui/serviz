import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import SubCategoryClient from "./SubCategoryClient"

export default async function SubCategoryPage({ 
  params 
}: { 
  params: Promise<{ categoryId: string; subCategoryId: string }> 
}) {
  const { categoryId, subCategoryId } = await params;

  const cat = await prisma.category.findUnique({ where: { slug: categoryId } })
  if (!cat) notFound()

  const sub = await prisma.subCategory.findUnique({
    where: { categoryId_slug: { categoryId: cat.id, slug: subCategoryId } },
    include: {
      services: {
        where: { isActive: true },
        include: { 
          seller: { select: { name: true } }, 
          packages: { orderBy: { price: "asc" }, take: 1 } 
        },
        orderBy: { reviewCount: "desc" },
      },
    },
  })
  if (!sub) notFound()

  const allSubs = await prisma.subCategory.findMany({ 
    where: { categoryId: cat.id }, 
    orderBy: { order: "asc" }, 
    select: { id: true, nameAr: true, name: true, slug: true } 
  })

  return <SubCategoryClient cat={cat} sub={sub} allSubs={allSubs} />
}