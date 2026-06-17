import { handlers } from "@/lib/auth"

export const runtime = "nodejs" // Force le moteur stable de Vercel
export const { GET, POST } = handlers