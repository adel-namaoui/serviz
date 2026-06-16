import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) redirect("/auth/login")

  // Redirection selon le rôle
  if (session.user.role === "ADMIN") {
    redirect("/admin")
  } else if (session.user.role === "FREELANCER") {
    redirect("/dashboard/freelancer")
  } else {
    // C'est un client
    redirect("/profile/orders")
  }
}