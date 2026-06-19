import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...i: ClassValue[]) => twMerge(clsx(i))

// Global currency formatter — change here once, affects the whole app
export const formatPrice = (amount: number): string => {
  return `${amount.toLocaleString("fr-DZ")} DZD`
}

// Legacy aliases kept for any old usages
export const fmt = formatPrice
export const fmtUSD = formatPrice