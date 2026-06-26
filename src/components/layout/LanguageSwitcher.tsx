"use client"
import { useTranslation } from "@/lib/locale-context"
import { locales, localeConfig, Locale } from "@/lib/i18n"
import { Globe, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fermer le menu si on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 h-9 px-3 rounded-xl hover:bg-secondary transition-all border border-border/50 text-sm font-medium"
      >
        <Globe className="h-4 w-4 text-muted-foreground" />
        <span>{localeConfig[locale].flag}</span>
        <span className="hidden sm:inline">{localeConfig[locale].label}</span>
        <ChevronDown className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 end-0 w-40 bg-popover border border-border rounded-2xl shadow-xl z-[100] py-2 animate-fade-up">
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => {
                setLocale(l as Locale)
                setIsOpen(false)
              }}
              className={cn(
                "w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-secondary transition-colors",
                locale === l ? "text-primary font-bold" : "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <span>{localeConfig[l as Locale].flag}</span>
                <span>{localeConfig[l as Locale].label}</span>
              </div>
              {locale === l && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}