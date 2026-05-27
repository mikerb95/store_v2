import type { Lang } from './data'

export function fmtMoney(n: number, currency = 'EUR', lang: Lang = 'en') {
  try {
    return new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n)
  } catch {
    return '€' + n
  }
}

export function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export function totalStock(stock: Record<string, number>) {
  return Object.values(stock).reduce((a, b) => a + b, 0)
}
