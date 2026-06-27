import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/Providers"
import { Navbar } from "@/components/layout/Navbar"
import { Toaster } from "@/components/ui/Toaster"
import { LocaleProvider } from "@/lib/locale-context" // <-- AJOUTÉ

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" })

export const metadata: Metadata = {
  title: { default: "BrandDZ | براند ديزاد", template: "%s | BrandDZ" },
  description: "أكبر سوق للخدمات المصغرة في الجزائر — La plus grande marketplace freelance d'Algérie",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.variable} style={{ fontFamily: "var(--font-cairo), system-ui, sans-serif" }}>
        <Providers>
          {/* On enveloppe tout le contenu avec le système de langue */}
          <LocaleProvider> 
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <footer className="border-t border-border/50 py-8 mt-12">
                <div className="container text-center text-sm text-muted-foreground">
                  © 2025 BrandDZ · أكبر سوق للخدمات المصغرة في الجزائر
                </div>
              </footer>
            </div>
            <Toaster />
          </LocaleProvider>
        </Providers>
      </body>
    </html>
  )
}