"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

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
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

const HistoryChart = () => {
  return (
    // ChartContainer handles the responsive sizing and applies the config variables
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        {/* Subtle horizontal grid layout */}
        <CartesianGrid vertical={false} className="stroke-neutral-200 dark:stroke-neutral-800" />
        
        {/* Clean, minimalist X Axis */}
        <XAxis 
          dataKey="month" 
          tickLine={false} 
          axisLine={false}
          tickMargin={10}
          className="fill-neutral-500 text-xs"
        />

        {/* Premium shadcn Tooltip component built on Recharts */}
        <ChartTooltip content={<ChartTooltipContent />} />
      
      </AreaChart>
    </ChartContainer>
  )
}

export default HistoryChart