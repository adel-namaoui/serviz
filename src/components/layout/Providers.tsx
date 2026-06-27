"use client"
import { SessionProvider } from "next-auth/react"
import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="dark" 
        enableSystem 
        disableTransitionOnChange // FIX #8 : Empêche le flash de couleur au chargement
      >
        {children}
      </ThemeProvider>
    </SessionProvider>
  )
}