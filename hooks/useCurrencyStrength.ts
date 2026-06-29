import { useQuery } from "@tanstack/react-query";

export interface StrengthResult {
  quote: string;
  open: number;
  last: number;
  change: number;
  percentChange: number;
}

async function fetchCurrencyStrength(base: string): Promise<StrengthResult[]> {
  const today = new Date();
  const to = today.toISOString().split("T")[0];
  
  const fromDate = new Date();
  fromDate.setDate(today.getDate() - 3); // Fetch last 3 days to ensure we hit at least 2 valid trading days (ignoring weekends)
  const from = fromDate.toISOString().split("T")[0];

  const url = `https://api.frankfurter.dev/v2/rates?base=${base}&from=${from}&to=${to}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch strength rates");

  const rawData: Array<{ date: string; base: string; quote: string; rate: number }> = await res.json();

  // Group by quote
  const grouped: Record<string, { date: string; rate: number }[]> = {};
  
  rawData.forEach(item => {
    if (!grouped[item.quote]) grouped[item.quote] = [];
    grouped[item.quote].push({ date: item.date, rate: item.rate });
  });

  const results: StrengthResult[] = [];

  Object.entries(grouped).forEach(([quote, dataPoints]) => {
    // Sort by date ascending
    dataPoints.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (dataPoints.length >= 2) {
      // Compare oldest vs newest in the window
      const open = dataPoints[0].rate;
      const last = dataPoints[dataPoints.length - 1].rate;
      const change = last - open;
      const percentChange = open !== 0 ? (change / open) * 100 : 0;
      
      results.push({
        quote,
        open,
        last,
        change,
        percentChange
      });
    }
  });

  // Sort by percent change descending (gainers first)
  results.sort((a, b) => b.percentChange - a.percentChange);

  return results;
}

export function useCurrencyStrength(base: string) {
  return useQuery({
    queryKey: ["currencyStrength", base],
    queryFn: () => fetchCurrencyStrength(base),
    staleTime: 60 * 1000 * 5, // 5 minutes
    retry: 2,
  });
}
