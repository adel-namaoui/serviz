import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilitaire pour fusionner les classes Tailwind proprement
 */
export const cn = (...i: ClassValue[]) => twMerge(clsx(i))

/**
 * Formateur de devise global pour BrandDZ
 * Transforme un nombre en format monétaire algérien (ex: 5000 -> 5 000 DA)
 */
export const formatPrice = (amount: number): string => {
  return `${amount.toLocaleString("fr-DZ")} DA` // DA après le chiffre
}