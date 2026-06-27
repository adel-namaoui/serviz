"use client"
import React, {
  createContext, useContext, useEffect, useState, useCallback, useMemo // Ajout de useMemo
} from "react"
import {
  Locale, Dict, defaultLocale, localeConfig, getDict,
} from "./i18n"

interface LocaleContextType {
  locale: Locale
  dir: "rtl" | "ltr"
  dict: Dict
  t: (key: keyof Dict) => string
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

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)
  const dict = getDict(locale)
  const dir = localeConfig[locale].dir

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (saved && ["ar", "fr", "en"].includes(saved)) {
      applyLocale(saved)
    }
  }, [])

  function applyLocale(newLocale: Locale) {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
    document.documentElement.lang = newLocale
    document.documentElement.dir = localeConfig[newLocale].dir
  }

  const t = useCallback(
    (key: keyof Dict): string => dict[key] ?? (key as string),
    [dict],
  )

  // FIX #9 : On mémorise la valeur pour empêcher les re-renders globaux
  const contextValue = useMemo(() => ({ 
    locale, dir, dict, t, setLocale: applyLocale 
  }), [locale, dir, dict, t]);

  return (
    <LocaleContext.Provider value={contextValue}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useTranslation() {
  return useContext(LocaleContext)
}