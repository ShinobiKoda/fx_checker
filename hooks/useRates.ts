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

  // Use the timeseries endpoint — the single-date endpoint always returns
  // the latest rates regardless of the date, so we need from/to params
  // to get actual historical data for comparison.
  const res = await fetch(
    `https://api.frankfurter.dev/v2/rates?base=${base}&from=${prev}&to=${today}`
  );

  if (!res.ok) throw new Error('Failed to fetch rates');

  const rawData: Array<{ date: string; base: string; quote: string; rate: number }> =
    await res.json();

  // Group by quote currency → collect all dated rates
  const grouped: Record<string, { date: string; rate: number }[]> = {};
  for (const item of rawData) {
    if (!grouped[item.quote]) grouped[item.quote] = [];
    grouped[item.quote].push({ date: item.date, rate: item.rate });
  }

  // For each quote currency, take the earliest and latest rate to compute change
  return Object.entries(grouped).map(([quote, entries]) => {
    entries.sort((a, b) => a.date.localeCompare(b.date));
    const earliest = entries[0];
    const latest = entries[entries.length - 1];

    let change = 0;
    let direction: 'up' | 'down' | 'flat' = 'flat';

    if (earliest.rate !== 0) {
      change = ((latest.rate - earliest.rate) / earliest.rate) * 100;
      if (change > 0.001) direction = 'up';
      else if (change < -0.001) direction = 'down';
    }

    return {
      date: latest.date,
      base,
      quote,
      rate: latest.rate,
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