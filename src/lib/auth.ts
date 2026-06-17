import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const user = await prisma.user.findUnique({ 
          where: { email: (credentials.email as string).trim() } 
        })
        if (!user || !user.passwordHash) return null
        
        const isPasswordOk = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!isPasswordOk) return null

        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { 
        // CORRECTION ICI : On ajoute "as string"
        token.id = user.id as string 
        token.role = (user as any).role as string
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) { 
        // CORRECTION ICI : On ajoute "as string"
        session.user.id = token.id as string
        ;(session.user as any).role = token.role as string 
      }
      return session
    },
  },
  pages: { signIn: "/auth/login" },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
})