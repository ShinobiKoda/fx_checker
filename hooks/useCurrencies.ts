import { useQuery } from '@tanstack/react-query';

export type CurrenciesResponse = Record<string, string>;

interface CurrencyV2 {
  iso_code: string;
  name: string;
  symbol: string;
}

async function fetchCurrencies(): Promise<CurrenciesResponse> {
  const res = await fetch('https://api.frankfurter.dev/v2/currencies');
  if (!res.ok) throw new Error('Failed to fetch currencies');
  const data: CurrencyV2[] = await res.json();

  // Transform array into { CODE: "Name" } map
  return data.reduce<CurrenciesResponse>((acc, curr) => {
    acc[curr.iso_code] = curr.name;
    return acc;
  }, {});
}

export function useCurrencies() {
  return useQuery({
    queryKey: ['currencies'],
    queryFn: fetchCurrencies,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    retry: 2,
  });
}
