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

export interface FavoritePair {
  id: string
  user_id: string
  from_currency: string
  to_currency: string
  created_at: string
}