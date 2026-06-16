import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
export const cn = (...i: ClassValue[]) => twMerge(clsx(i))
export const fmt = (n: number) => `${n.toLocaleString("fr-DZ")} DA`
export const fmtUSD = (n: number) => `$${n.toFixed(0)}`
