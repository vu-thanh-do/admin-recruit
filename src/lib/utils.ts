// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number | Date): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num)
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) {
    return str
  }
  return str.slice(0, length)
}
