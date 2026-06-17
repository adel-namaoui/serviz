import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({ 
  email: z.string().email(), 
  password: z.string().min(6) 
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const p = schema.safeParse(credentials)
        if (!p.success) return null
        const user = await prisma.user.findUnique({ where: { email: p.data.email } })
        if (!user || !user.passwordHash) return null
        const isPasswordOk = await bcrypt.compare(p.data.password, user.passwordHash)
        if (!isPasswordOk) return null

        return { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          role: user.role // On s'assure que le rôle est bien là
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { 
        token.id = user.id as string 
        token.role = (user as any).role 
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) { 
        session.user.id = token.id as string
        (session.user as any).role = token.role as string 
      }
      return session
    },
  },
  pages: { signIn: "/auth/login" },
  secret: process.env.AUTH_SECRET, // On utilise uniquement AUTH_SECRET
})