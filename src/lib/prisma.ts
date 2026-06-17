import { PrismaClient } from "@prisma/client"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"], // On ne log que les erreurs pour ne pas ralentir
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma