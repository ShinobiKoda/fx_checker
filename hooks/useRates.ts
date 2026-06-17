import { useQuery } from '@tanstack/react-query'
import { LatestRatesResponse } from '@/types'

function formatDate(date: Date) {
  return date.toISOString().split('T')[0];
}

async function fetchRates(base: string): Promise<LatestRatesResponse> {
  const endDateObj = new Date();
  const startDateObj = new Date();
  startDateObj.setDate(endDateObj.getDate() - 4);

  const endDate = formatDate(endDateObj);
  const startDate = formatDate(startDateObj);

  const res = await fetch(`https://api.frankfurter.app/${startDate}..${endDate}?from=${base}`);
  if (!res.ok) throw new Error('Failed to fetch rates');
  const data = await res.json();

  const dates = Object.keys(data.rates || {}).sort();
  if (dates.length === 0) return [];

  const latestDate = dates[dates.length - 1];
  const previousDate = dates.length > 1 ? dates[dates.length - 2] : null;

  const latestRates = data.rates[latestDate];
  const previousRates = previousDate ? data.rates[previousDate] : {};

  return Object.entries(latestRates).map(([quote, rate]) => {
    const latestRate = rate as number;
    let change = 0;
    let direction: 'up' | 'down' | 'flat' = 'flat';

    if (previousDate && previousRates[quote]) {
      const prevRate = previousRates[quote] as number;
      change = ((latestRate - prevRate) / prevRate) * 100;
      
      if (change > 0) direction = 'up';
      else if (change < 0) direction = 'down';
    }

    return {
      date: latestDate,
      base,
      quote,
      rate: latestRate,
      change: parseFloat(change.toFixed(2)),
      direction
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