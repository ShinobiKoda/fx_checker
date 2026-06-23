import { useQuery } from "@tanstack/react-query";

export interface HistoryDataPoint {
  date: string;
  rate: number;
}

export interface HistorySummary {
  open: number;
  last: number;
  change: number;
  percentChange: number;
  direction: "up" | "down" | "flat";
}

export interface HistoryResult {
  data: HistoryDataPoint[];
  summary: HistorySummary;
}

function getDateRange(period: string): { from: string; to: string; group?: string } {
  const today = new Date();
  const to = today.toISOString().split("T")[0];
  const fromDate = new Date(today);

  let group: string | undefined;

  switch (period) {
    case "1D":
      fromDate.setDate(today.getDate() - 1);
      break;
    case "1W":
      fromDate.setDate(today.getDate() - 7);
      break;
    case "1M":
      fromDate.setMonth(today.getMonth() - 1);
      break;
    case "3M":
      fromDate.setMonth(today.getMonth() - 3);
      break;
    case "1Y":
      fromDate.setFullYear(today.getFullYear() - 1);
      group = "week";
      break;
    case "5Y":
      fromDate.setFullYear(today.getFullYear() - 5);
      group = "month";
      break;
    default:
      fromDate.setMonth(today.getMonth() - 1);
  }

  const from = fromDate.toISOString().split("T")[0];
  return { from, to, group };
}

async function fetchHistory(
  base: string,
  quote: string,
  period: string
): Promise<HistoryResult> {
  const { from, to, group } = getDateRange(period);

  let url = `https://api.frankfurter.dev/v2/rates?base=${base}&quotes=${quote}&from=${from}&to=${to}`;
  if (group) {
    url += `&group=${group}`;
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch historical rates");

  const rawData: Array<{ date: string; base: string; quote: string; rate: number }> =
    await res.json();

  const data: HistoryDataPoint[] = rawData.map((item) => ({
    date: item.date,
    rate: item.rate,
  }));

  // Derive summary
  const open = data.length > 0 ? data[0].rate : 0;
  const last = data.length > 0 ? data[data.length - 1].rate : 0;
  const change = last - open;
  const percentChange = open !== 0 ? (change / open) * 100 : 0;

  let direction: "up" | "down" | "flat" = "flat";
  if (change > 0.00001) direction = "up";
  else if (change < -0.00001) direction = "down";

  return {
    data,
    summary: {
      open: parseFloat(open.toFixed(4)),
      last: parseFloat(last.toFixed(4)),
      change: parseFloat(change.toFixed(4)),
      percentChange: parseFloat(percentChange.toFixed(2)),
      direction,
    },
  };
}

export function useHistory(base: string, quote: string, period: string) {
  return useQuery({
    queryKey: ["history", base, quote, period],
    queryFn: () => fetchHistory(base, quote, period),
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
}
