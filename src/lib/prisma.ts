import { PrismaClient } from "@prisma/client"

// On définit un type pour l'objet global afin d'éviter les erreurs TypeScript
const globalForPrisma = global as unknown as { prisma: PrismaClient }

/**
 * FIX #9 : Configuration du client Prisma pour le Serverless (Vercel)
 * 
 * Pourquoi ? Sur Vercel, chaque fonction peut créer une nouvelle connexion.
 * Sans limite, on dépasse vite les 10-20 connexions autorisées par Neon (plan gratuit).
 */
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["error"],
    // On force la limite de connexion à 1 par instance de fonction
    datasources: {
      db: {
        url: `${process.env.DATABASE_URL}${process.env.DATABASE_URL?.includes('?') ? '&' : '?'}connection_limit=1&pool_timeout=0`
      },
    },
  })

// En mode développement, on garde l'instance en mémoire pour éviter de 
// recréer une connexion à chaque fois que vous modifiez un fichier (Hot Reload)
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma