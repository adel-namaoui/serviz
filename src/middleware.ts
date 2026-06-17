import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const path = req.nextUrl.pathname

  // RÈGLE NOUVELLE : Si déjà connecté, interdit d'aller sur la page de LOGIN
  // Cela évite de rester bloqué sur le formulaire alors qu'on est déjà Admin
  if (token && path.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // 1. Protection Admin
  if (path.startsWith("/admin")) {
    if (!token) return NextResponse.redirect(new URL("/auth/login", req.url))
    if (token.role !== "ADMIN") return NextResponse.redirect(new URL("/", req.url))
  }

  // 2. Protection Freelancer
  if (path.startsWith("/dashboard/freelancer")) {
    if (!token) return NextResponse.redirect(new URL("/auth/login", req.url))
    if (token.role !== "FREELANCER") return NextResponse.redirect(new URL("/", req.url))
  }

  // 3. Protection Pages Utilisateurs (Checkout, Profil, Orders, Dashboard)
  const protectedPaths = ["/checkout", "/orders", "/profile", "/dashboard"]
  if (protectedPaths.some(r => path.startsWith(r))) {
    if (!token) {
      const url = new URL("/auth/login", req.url)
      url.searchParams.set("from", path)
      return NextResponse.redirect(url)
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
    "/auth/login" // On ajoute le login au matcher pour la nouvelle règle
  ] 
}