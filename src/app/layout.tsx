import type { Metadata } from "next"
import { Cairo } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/layout/Providers"
import { Navbar } from "@/components/layout/Navbar"
import { Toaster } from "@/components/ui/Toaster"

const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo", display: "swap" })

export const metadata: Metadata = {
  title: { default: "Serviz | سيرفيز", template: "%s | Serviz" },
  description: "أكبر سوق للخدمات المصغرة في الجزائر — La plus grande marketplace freelance d'Algérie",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={cairo.variable} style={{ fontFamily: "var(--font-cairo), system-ui, sans-serif" }}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-border/50 py-8 mt-12">
              <div className="container text-center text-sm text-muted-foreground">
                © 2025 Serviz · أكبر سوق للخدمات المصغرة في الجزائر
              </div>
            </footer>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
