import { handlers } from "@/lib/auth"

export const runtime = "nodejs" // <-- AJOUTEZ CETTE LIGNE
export const { GET, POST } = handlers