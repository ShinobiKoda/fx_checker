export type CurrencyCode = string

export interface RateMap {
  [currency: CurrencyCode]: number
}

export interface RateItem {
  date: string
  base: CurrencyCode
  quote: CurrencyCode
  rate: number
}

export type LatestRatesResponse = RateItem[]