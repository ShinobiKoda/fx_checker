import { useQuery } from '@tanstack/react-query'
import { LatestRatesResponse, RateItem } from '@/types'

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

async function fetchRates(base: string): Promise<LatestRatesResponse> {
  const todayObj = new Date();
  const prevObj = new Date();
  prevObj.setDate(todayObj.getDate() - 4);

  const today = formatDate(todayObj);
  const prev = formatDate(prevObj);

  // Fetch both dates in parallel
  const [latestRes, prevRes] = await Promise.all([
    fetch(`https://api.frankfurter.dev/v2/rates/${today}?base=${base}`),
    fetch(`https://api.frankfurter.dev/v2/rates/${prev}?base=${base}`),
  ]);

  if (!latestRes.ok) throw new Error('Failed to fetch latest rates');

  const latestData: RateItem[] = await latestRes.json();
  // If prev fetch failed (e.g. weekend), fallback gracefully
  const prevData: RateItem[] = prevRes.ok ? await prevRes.json() : [];

  // Build a lookup map of previous rates by quote currency
  const prevMap: Record<string, number> = {};
  for (const item of prevData) {
    prevMap[item.quote] = item.rate;
  }

  return latestData.map((item) => {
    const prevRate = prevMap[item.quote];
    let change = 0;
    let direction: 'up' | 'down' | 'flat' = 'flat';

    if (prevRate !== undefined && prevRate !== 0) {
      change = ((item.rate - prevRate) / prevRate) * 100;
      if (change > 0.001) direction = 'up';
      else if (change < -0.001) direction = 'down';
    }

    return {
      ...item,
      change: parseFloat(change.toFixed(2)),
      direction,
    };
  });
}


export function useRates(bases: string | string[]) {
  const baseArray = Array.isArray(bases) ? bases : [bases];

  return useQuery({
    queryKey: ['rates', baseArray.join(',')],
    queryFn: async () => {
      const promises = baseArray.map(base => fetchRates(base));
      const results = await Promise.all(promises);
      return results.flat();
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 2,
  })
}