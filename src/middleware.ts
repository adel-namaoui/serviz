import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  // ── THE CORE FIX ─────────────────────────────────────────────
  // Vercel env has AUTH_SECRET, local has NEXTAUTH_SECRET.
  // Read both so it works in all environments.
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

  // NextAuth v5 beta cookie names differ by protocol:
  //   HTTPS (Vercel production) → "__Secure-authjs.session-token"
  //   HTTP  (localhost)         → "authjs.session-token"
  // We try the secure name first, fall back to plain name.
  const isSecure = req.url.startsWith("https://")
  const cookieName = isSecure
    ? "__Secure-authjs.session-token"
    : "authjs.session-token"

  const token = await getToken({ req, secret, cookieName })

  const path = req.nextUrl.pathname

  if (path.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/auth/login", req.url))
    if (token.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url))
  }

  const protectedPaths = ["/checkout", "/orders", "/profile", "/dashboard"]
  if (protectedPaths.some(r => path.startsWith(r))) {
    if (!token) {
      return NextResponse.redirect(
        new URL(`/auth/login?from=${encodeURIComponent(path)}`, req.url)
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/checkout",
    "/orders/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
  ],
}
