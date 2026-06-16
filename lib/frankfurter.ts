import { LatestRatesResponse } from "@/types"

const BASE_URL = 'https://api.frankfurter.app/latest'

export async function getLatestRates(base: string): Promise<LatestRatesResponse> {
  const res = await fetch(`${BASE_URL}?from=${base}`)
  if (!res.ok) throw new Error('Failed to fetch latest rates')
  return res.json()
}