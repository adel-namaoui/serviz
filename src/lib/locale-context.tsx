"use client"
// src/lib/locale-context.tsx
// ─────────────────────────────────────────────────────────────
// Provides `useTranslation()` hook to all client components.
// Persists the chosen language in localStorage so it survives
// page refreshes. Switches `<html dir>` for RTL/LTR automatically.
// ─────────────────────────────────────────────────────────────

import React, {
  createContext, useContext, useEffect, useState, useCallback,
} from "react"
import {
  Locale, Dict, defaultLocale, localeConfig, getDict,
} from "./i18n"

// ── Context shape ─────────────────────────────────────────────
interface LocaleContextType {
  locale: Locale
  dir: "rtl" | "ltr"
  dict: Dict
  /** Translate a key */
  t: (key: keyof Dict) => string
  /** Switch language */
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType>({
  locale: defaultLocale,
  dir: "rtl",
  dict: getDict(defaultLocale),
  t: (k) => k as string,
  setLocale: () => {},
})

const STORAGE_KEY = "serviz-locale"

// ── Provider ──────────────────────────────────────────────────
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const dict = getDict(locale)
  const dir = localeConfig[locale].dir

  // Load saved preference on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && ["ar", "fr", "en"].includes(saved)) {
      applyLocale(saved)
    }
  }, [])

  function applyLocale(newLocale: Locale) {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
    // Switch dir + lang on the <html> element immediately
    const dir = localeConfig[newLocale].dir
    document.documentElement.lang = newLocale
    document.documentElement.dir = dir
  }

  const t = useCallback(
    (key: keyof Dict): string => dict[key] ?? (key as string),
    [dict],
  )

  return (
    <LocaleContext.Provider value={{ locale, dir, dict, t, setLocale: applyLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────
export function useTranslation() {
  return useContext(LocaleContext)
}