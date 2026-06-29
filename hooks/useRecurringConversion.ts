import { useQuery } from "@tanstack/react-query";

export interface MonthlyConversion {
  month: string; // e.g. "Jan 2025"
  date: string; // ISO date (first of month)
  rate: number;
  convertedAmount: number;
}

async function fetchMonthlyRates(
  base: string,
  quote: string,
  amount: number
): Promise<MonthlyConversion[]> {
  const today = new Date();
  const fromDate = new Date(today);
  fromDate.setMonth(today.getMonth() - 11); // 12 months including current
  fromDate.setDate(1); // Start from 1st of that month

  const from = fromDate.toISOString().split("T")[0];
  const to = today.toISOString().split("T")[0];

  const url = `https://api.frankfurter.dev/v2/rates?base=${base}&quotes=${quote}&from=${from}&to=${to}&group=month`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch monthly rates");

  const rawData: Array<{ date: string; base: string; quote: string; rate: number }> =
    await res.json();

  return rawData.map((item) => ({
    month: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    }),
    date: item.date,
    rate: item.rate,
    convertedAmount: parseFloat((amount * item.rate).toFixed(2)),
  }));
}

export function useRecurringConversion(base: string, quote: string, amount: number) {
  return useQuery({
    queryKey: ["recurringConversion", base, quote, amount],
    queryFn: () => fetchMonthlyRates(base, quote, amount),
    staleTime: 60 * 1000 * 30, // 30 minutes
    enabled: amount > 0 && base !== quote,
    retry: 2,
  });
}
