import { LatestRatesResponse } from "@/types"

const BASE_URL = 'https://api.frankfurter.dev/v2/rates'

export async function getLatestRates(base: string): Promise<LatestRatesResponse> {
  const res = await fetch(`${BASE_URL}?base=${base}`)
  if (!res.ok) throw new Error('Failed to fetch latest rates')
  return res.json()
}