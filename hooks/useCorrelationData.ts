import { useQuery } from "@tanstack/react-query";

const CORRELATION_BASKET = ["EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "ZAR", "BRL"];

export interface CorrelationDataPoint {
  date: string;
  rates: Record<string, number>;
}

async function fetchCorrelationData(base: string): Promise<Record<string, number[]>> {
  const today = new Date();
  const to = today.toISOString().split("T")[0];
  
  const fromDate = new Date();
  fromDate.setDate(today.getDate() - 90); // 90 days of history
  const from = fromDate.toISOString().split("T")[0];

  const quotes = CORRELATION_BASKET.filter(q => q !== base).join(",");
  const url = `https://api.frankfurter.dev/v2/rates?base=${base}&quotes=${quotes}&from=${from}&to=${to}`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch correlation timeseries");

  const rawData: Array<{ date: string; base: string; quote: string; rate: number }> = await res.json();

  // We need to group rates by quote so we have an array of rates for each currency (aligned by date ideally).
  // First, let's group by date to ensure alignment
  const dateMap: Record<string, Record<string, number>> = {};
  
  rawData.forEach(item => {
    if (!dateMap[item.date]) dateMap[item.date] = {};
    dateMap[item.date][item.quote] = item.rate;
  });

  // Sort dates
  const sortedDates = Object.keys(dateMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  // Build the aligned timeseries arrays
  const timeseries: Record<string, number[]> = {};
  
  // Initialize arrays
  CORRELATION_BASKET.forEach(q => {
    if (q !== base) timeseries[q] = [];
  });

  sortedDates.forEach(date => {
    const dailyRates = dateMap[date];
    CORRELATION_BASKET.forEach(q => {
      if (q !== base) {
        // If a rate is missing for a specific date, we duplicate the previous day's rate (forward fill)
        // or just skip. Frankfurter usually returns complete sets, but fallback to 0 if totally missing.
        const rate = dailyRates[q] || (timeseries[q].length > 0 ? timeseries[q][timeseries[q].length - 1] : 0);
        timeseries[q].push(rate);
      }
    });
  });

  return timeseries;
}

export function useCorrelationData(base: string) {
  return useQuery({
    queryKey: ["correlationData", base],
    queryFn: () => fetchCorrelationData(base),
    staleTime: 60 * 1000 * 60, // 1 hour
    retry: 2,
  });
}
