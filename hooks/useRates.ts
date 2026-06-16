import { useQuery } from '@tanstack/react-query'
import { LatestRatesResponse } from '@/types'

async function fetchRates(base: string): Promise<LatestRatesResponse> {
  const res = await fetch(`/api/rates?base=${base}`)
  if (!res.ok) throw new Error('Failed to fetch rates')
  return res.json()
}

export function useRates(base: string) {
  return useQuery({
    queryKey: ['rates', base],
    queryFn: () => fetchRates(base),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  })
}