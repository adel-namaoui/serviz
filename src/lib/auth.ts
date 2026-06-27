import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  trustHost: true,

  providers: [
    Credentials({
      async authorize(credentials) {
        const p = schema.safeParse(credentials)
        if (!p.success) return null

        const user = await prisma.user.findUnique({
          where: { email: p.data.email },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            passwordHash: true,
          },
        })

        if (!user?.passwordHash) return null
        const ok = await bcrypt.compare(p.data.password, user.passwordHash)
        if (!ok) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image ?? null,
          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) { 
        token.id = user.id as string 
        // FIX #14 : Plus besoin de (user as any).role
        token.role = user.role 
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) { 
        session.user.id = token.id
        // FIX #14 : Plus besoin de (session.user as any).role
        session.user.role = token.role 
      }
      return session
    },
  },

  pages: { signIn: "/auth/login" },
})
