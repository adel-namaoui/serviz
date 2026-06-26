"use client"
import Link from "next/link"
import { CheckCircle2, Star, DollarSign, Clock } from "lucide-react"
import { useTranslation } from "@/lib/locale-context"

export default function SellPage() {
  const { t } = useTranslation()

  const steps = [
    { icon: Star, t: t("sell.step1.title"), d: t("sell.step1.desc") },
    { icon: DollarSign, t: t("sell.step2.title"), d: t("sell.step2.desc") },
    { icon: Clock, t: t("sell.step3.title"), d: t("sell.step3.desc") }
  ]

  const benefits = [
    t("sell.benefits.free"),
    t("sell.benefits.pricing"),
    t("sell.benefits.reach"),
    t("sell.benefits.ratings"),
    t("sell.benefits.support"),
    t("sell.benefits.payments")
  ]

  return (
    <div>
      <div className="relative overflow-hidden py-20 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_-10%,hsl(174,72%,42%,0.15),transparent)]" />
        <div className="container relative">
          <h1 className="text-4xl font-bold mb-4">
            {t("sell.title")} <span className="text-primary italic">BrandDZ</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto mb-8">
            {t("sell.subtitle")}
          </p>
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 active:scale-[0.97] transition-all">
            {t("sell.cta")}
          </Link>
        </div>
      </div>

      <div className="container pb-20">
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {steps.map(s => (
            <div key={s.t} className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{s.t}</h3>
              <p className="text-muted-foreground text-sm">{s.d}</p>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-3xl p-8 text-center max-w-4xl mx-auto shadow-sm">
          <h2 className="text-xl font-bold mb-8">{t("sell.benefits.title")}</h2>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg mx-auto text-start mb-10">
            {benefits.map(b => (
              <div key={b} className="flex items-center gap-2 text-sm font-medium">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                {b}
              </div>
            ))}
          </div>
          <Link href="/auth/register" className="inline-flex px-10 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
            {t("home.cta.button")}
          </Link>
        </div>
      </div>
    </div>
  )
}