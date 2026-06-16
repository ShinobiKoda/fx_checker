export type CurrencyCode = string

export interface RateMap {
  [currency: CurrencyCode]: number
}

export interface LatestRatesResponse {
  base: CurrencyCode
  date: string
  quote: string
  rate: RateMap
}