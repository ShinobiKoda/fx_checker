import { useQuery } from '@tanstack/react-query'
import { LatestRatesResponse, RateItem } from '@/types'

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

async function fetchRates(base: string): Promise<LatestRatesResponse> {
  const todayObj = new Date();
  
  // For 1D change (using 4 days to account for weekends)
  const prev4dObj = new Date();
  prev4dObj.setDate(todayObj.getDate() - 4);
  
  // For 30D change
  const prev30dObj = new Date();
  prev30dObj.setDate(todayObj.getDate() - 30);

  const today = formatDate(todayObj);
  const prev30d = formatDate(prev30dObj);

  // Fetch 30 days of data in one go
  const res = await fetch(
    `https://api.frankfurter.dev/v2/rates?base=${base}&from=${prev30d}&to=${today}`
  );

  if (!res.ok) throw new Error('Failed to fetch rates');

  const rawData: Array<{ date: string; base: string; quote: string; rate: number }> = await res.json();

  // Group by quote currency
  const grouped: Record<string, { date: string; rate: number }[]> = {};
  for (const item of rawData) {
    if (!grouped[item.quote]) grouped[item.quote] = [];
    grouped[item.quote].push({ date: item.date, rate: item.rate });
  }

  // Calculate changes for each quote
  return Object.entries(grouped).map(([quote, entries]) => {
    entries.sort((a, b) => a.date.localeCompare(b.date));
    
    const latest = entries[entries.length - 1];
    const earliest30d = entries[0];
    
    // Find the earliest entry within the 4-day window for the 1D change calculation
    const prev4dString = formatDate(prev4dObj);
    const entries4d = entries.filter(e => e.date >= prev4dString);
    const earliest4d = entries4d.length > 0 ? entries4d[0] : earliest30d;

    let change = 0;
    let direction: 'up' | 'down' | 'flat' = 'flat';
    
    let change30d = 0;
    let direction30d: 'up' | 'down' | 'flat' = 'flat';

    if (earliest4d && earliest4d.rate !== 0) {
      change = ((latest.rate - earliest4d.rate) / earliest4d.rate) * 100;
      if (change > 0.001) direction = 'up';
      else if (change < -0.001) direction = 'down';
    }
    
    if (earliest30d && earliest30d.rate !== 0) {
      change30d = ((latest.rate - earliest30d.rate) / earliest30d.rate) * 100;
      if (change30d > 0.001) direction30d = 'up';
      else if (change30d < -0.001) direction30d = 'down';
    }

    return {
      date: latest.date,
      base,
      quote,
      rate: latest.rate,
      change: parseFloat(change.toFixed(2)),
      direction,
      change30d: parseFloat(change30d.toFixed(2)),
      direction30d,
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