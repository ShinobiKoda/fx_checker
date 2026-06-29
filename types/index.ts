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
  change30d?: number
  direction30d?: 'up' | 'down' | 'flat'
  cached_at?: string
}
export type LatestRatesResponse = RateItem[]

export interface FavoritePair {
  id: string
  user_id: string
  from_currency: string
  to_currency: string
  created_at: string
}

export interface ConversionLog {
  id: string
  user_id: string
  from_currency: string
  to_currency: string
  amount: number
  converted_amount: number
  created_at: string
}

export interface RateAlert {
  id: string
  user_id: string
  from_currency: string
  to_currency: string
  target_rate: number
  condition: 'above' | 'below'
  triggered: boolean
  created_at: string
}

export interface DashboardRateItem {
  quote: string
  rate: number
  convertedAmount: number
  change1d: number
  direction1d: 'up' | 'down' | 'flat'
  change30d: number
  direction30d: 'up' | 'down' | 'flat'
}