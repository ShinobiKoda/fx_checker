"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
const chartData = [
  { date: "2024-04-01", desktop: 222, mobile: 150 },
  { date: "2024-04-02", desktop: 97, mobile: 180 },
  { date: "2024-04-03", desktop: 167, mobile: 120 },
  { date: "2024-04-04", desktop: 242, mobile: 260 },
  { date: "2024-04-05", desktop: 373, mobile: 290 },
  { date: "2024-04-06", desktop: 301, mobile: 340 },
  { date: "2024-04-07", desktop: 245, mobile: 180 },
];
// 2. Map your data keys to labels and theme colors
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "#d9f99d",
  },
  mobile: {
    label: "Mobile",
    color: "#d9f99d",
  },
} satisfies ChartConfig;

const HistoryChart = () => {
  return (
    // ChartContainer handles the responsive sizing and applies the config variables
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart
        data={chartData}
        margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
      >
        <defs>
          <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#d9f99d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#d9f99d" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#d9f99d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#d9f99d" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        {/* Subtle horizontal grid layout */}
        <CartesianGrid
          vertical={false}
          className="stroke-neutral-200 dark:stroke-neutral-800"
        />

        {/* Clean, minimalist X Axis */}
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) =>
            new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }
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
                });
              }}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="mobile"
          type="linear"
          fill="url(#fillMobile)"
          stroke="#d9f99d"
          strokeWidth={2.5}
        />
        <Area
          dataKey="desktop"
          type="linear"
          fill="url(#fillDesktop)"
          stroke="#d9f99d"
          strokeWidth={2.5}
          stackId="a"
        />
        <ChartLegend content={<ChartLegendContent />} />
      </AreaChart>
    </ChartContainer>
  );
};

export default HistoryChart;
