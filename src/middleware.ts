import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const role = (req.auth?.user as any)?.role

  // 1. Rediriger si déjà connecté et tente d'aller sur Login
  if (isLoggedIn && nextUrl.pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl))
  }

  // 2. Protection Admin
  if (nextUrl.pathname.startsWith("/admin")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/auth/login", nextUrl))
    if (role !== "ADMIN") return NextResponse.redirect(new URL("/", nextUrl))
  }

  // 3. Protection Freelancer
  if (nextUrl.pathname.startsWith("/dashboard/freelancer")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/auth/login", nextUrl))
    if (role !== "FREELANCER") return NextResponse.redirect(new URL("/", nextUrl))
  }

  // 4. Protection Pages Utilisateurs (Orders, Profile, Checkout)
  const isProtected = ["/profile", "/orders", "/checkout", "/dashboard"].some(path => 
    nextUrl.pathname.startsWith(path)
  )
  
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL("/auth/login", nextUrl)
    loginUrl.searchParams.set("from", nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}