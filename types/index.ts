export type CurrencyCode = string

export interface RateMap {
  [currency: CurrencyCode]: number
}

export interface LatestRatesResponse {
  amount: number
  base: CurrencyCode
  date: string
  rates: RateMap
}