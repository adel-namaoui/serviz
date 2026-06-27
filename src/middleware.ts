import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

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

  // FIX : Ajout de "/freelancer" dans les chemins protégés
  const protectedPaths = ["/checkout", "/orders", "/profile", "/dashboard", "/freelancer"]
  
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
    "/api/admin/:path*",
    "/checkout",
    "/orders/:path*",
    "/profile/:path*",
    "/dashboard/:path*",
    "/freelancer/:path*", // <-- AJOUTÉ ICI
    "/api/orders/:path*",
    "/api/reviews/:path*",
  ],
}