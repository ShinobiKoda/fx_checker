"use client";

import { useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { HistoryDataPoint } from "@/hooks/useHistory";

const chartConfig = {
  rate: {
    label: "Rate",
    color: "#d9f99d",
  },
} satisfies ChartConfig;

interface HistoryChartProps {
  data: HistoryDataPoint[];
}

const HistoryChart = ({ data }: HistoryChartProps) => {
  // Calculate evenly spaced tick indices (~3-4 ticks)
  const xTickIndices = useMemo(() => {
    const count = data.length;
    if (count <= 4) return data.map((_, i) => i);
    const tickCount = 4;
    const step = (count - 1) / (tickCount - 1);
    return Array.from({ length: tickCount }, (_, i) =>
      Math.round(i * step)
    );
  }, [data]);

  // Calculate Y axis domain with some padding
  const yDomain = useMemo(() => {
    if (data.length === 0) return [0, 1];
    const rates = data.map((d) => d.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const padding = (max - min) * 0.1 || 0.001;
    return [
      parseFloat((min - padding).toFixed(4)),
      parseFloat((max + padding).toFixed(4)),
    ];
  }, [data]);

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 5, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillRate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#d9f99d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#d9f99d" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <CartesianGrid
          vertical={false}
          className="stroke-neutral-200 dark:stroke-neutral-800"
        />

        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          ticks={xTickIndices.map((i) => data[i]?.date).filter(Boolean)}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })
          }
          className="fill-neutral-500 text-xs"
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={yDomain}
          tickCount={5}
          tickFormatter={(value: number) => value.toFixed(4)}
          className="fill-neutral-500 text-xs"
        />

        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="rate"
          type="linear"
          fill="url(#fillRate)"
          stroke="#d9f99d"
          strokeWidth={2.5}
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default HistoryChart;
