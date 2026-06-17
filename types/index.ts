export type CurrencyCode = string

export interface RateMap {
  [currency: CurrencyCode]: number
}

export interface RateItem {
  date?: string
  base: string
  quote: string
  rate: number
  change: number
  direction: 'up' | 'down' | 'flat'
}

export type LatestRatesResponse = RateItem[]