"use client";

import React, { useState, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useRecurringConversion } from "@/hooks/useRecurringConversion";
import { useCurrencies } from "@/hooks/useCurrencies";
import { ShimmerBlock, SlideUp } from "@/components/Motion";
import { IoMdArrowDropdown } from "react-icons/io";

const chartConfig = {
  convertedAmount: {
    label: "Converted",
    color: "var(--chart-rate)",
  },
} satisfies ChartConfig;

const PRESET_AMOUNTS = [100, 250, 500, 1000, 2500, 5000];

const getFlagEmoji = (code: string) => {
  if (code === "EUR") return "🇪🇺";
  const cc = code.slice(0, 2);
  return String.fromCodePoint(...[...cc].map((c) => 0x1f1e6 + c.charCodeAt(0) - 65));
};

const RecurringTracker = () => {
  const [amount, setAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("NGN");

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const { data: currencies } = useCurrencies();
  const { data: monthlyData, isLoading } = useRecurringConversion(
    fromCurrency,
    toCurrency,
    effectiveAmount
  );

  // Calculate stats
  const stats = useMemo(() => {
    if (!monthlyData || monthlyData.length < 2) return null;

    const amounts = monthlyData.map((d) => d.convertedAmount);
    const max = Math.max(...amounts);
    const min = Math.min(...amounts);
    const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
    const latest = amounts[amounts.length - 1];
    const first = amounts[0];
    const totalChange = ((latest - first) / first) * 100;

    return { max, min, avg, latest, totalChange };
  }, [monthlyData]);

  // Color bars based on whether above or below average
  const getBarColor = (value: number) => {
    if (!stats) return "#84cc16"; // lime-500
    if (value >= stats.avg) return "#4ade80"; // green-400
    return "#f87171"; // red-400
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 lg:col-span-2">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-medium text-neutral-50">Recurring Conversion Tracker</h3>
          <p className="text-neutral-400 text-[13px] leading-relaxed mt-1">
            Track what a fixed recurring amount has been worth over the last 12 months.
          </p>
        </div>
      </div>

      {/* Configuration Row */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-neutral-700/50 rounded-xl p-4 border border-neutral-600/50">
        <span className="text-neutral-400 text-sm shrink-0">I receive</span>

        {/* Preset amount chips */}
        <div className="flex flex-wrap gap-1.5">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setAmount(preset);
                setCustomAmount("");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                effectiveAmount === preset && !customAmount
                  ? "bg-lime-500 text-black"
                  : "bg-neutral-600 text-neutral-300 hover:bg-neutral-500 border border-neutral-500"
              }`}
            >
              {preset.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Custom amount input */}
        <input
          type="number"
          placeholder="Custom"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="w-24 bg-neutral-600 border border-neutral-500 text-neutral-50 text-sm py-1.5 px-3 rounded-lg outline-none focus:border-lime-500 transition-colors placeholder:text-neutral-400"
        />

        {/* From currency */}
        <div className="relative">
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="appearance-none bg-neutral-600 border border-neutral-500 text-neutral-50 text-sm py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-lime-500 transition-colors"
          >
            {currencies &&
              Object.entries(currencies).map(([code]) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>

        <span className="text-neutral-400 text-sm shrink-0">→ in</span>

        {/* To currency */}
        <div className="relative">
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="appearance-none bg-neutral-600 border border-neutral-500 text-neutral-50 text-sm py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-lime-500 transition-colors"
          >
            {currencies &&
              Object.entries(currencies).map(([code]) => (
                <option key={code} value={code}>
                  {code}
                </option>
              ))}
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>

        <span className="text-neutral-400 text-sm shrink-0">every month</span>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col gap-4">
          <ShimmerBlock width="100%" height="250px" rounded="12px" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <ShimmerBlock width="100%" height="60px" rounded="8px" />
            <ShimmerBlock width="100%" height="60px" rounded="8px" />
            <ShimmerBlock width="100%" height="60px" rounded="8px" />
            <ShimmerBlock width="100%" height="60px" rounded="8px" />
          </div>
        </div>
      )}

      {/* Chart + Stats */}
      {!isLoading && monthlyData && monthlyData.length > 0 && (
        <>
          {/* Stats Strip */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="bg-neutral-700/50 rounded-xl p-3 border border-neutral-600/50">
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                  Latest Month
                </p>
                <p className="text-neutral-50 font-bold text-lg mt-1">
                  {stats.latest.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-xs text-neutral-400">{toCurrency}</span>
                </p>
              </div>
              <div className="bg-neutral-700/50 rounded-xl p-3 border border-neutral-600/50">
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                  12M Average
                </p>
                <p className="text-neutral-50 font-bold text-lg mt-1">
                  {stats.avg.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-xs text-neutral-400">{toCurrency}</span>
                </p>
              </div>
              <div className="bg-neutral-700/50 rounded-xl p-3 border border-neutral-600/50">
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                  Best Month
                </p>
                <p className="text-green-400 font-bold text-lg mt-1">
                  {stats.max.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-xs text-neutral-400">{toCurrency}</span>
                </p>
              </div>
              <div className="bg-neutral-700/50 rounded-xl p-3 border border-neutral-600/50">
                <p className="text-[11px] text-neutral-500 uppercase tracking-wider font-medium">
                  12M Change
                </p>
                <p
                  className={`font-bold text-lg mt-1 ${
                    stats.totalChange >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stats.totalChange >= 0 ? "+" : ""}
                  {stats.totalChange.toFixed(1)}%
                </p>
              </div>
            </div>
          )}

          {/* Bar Chart */}
          <SlideUp delay={0.15} distance={15}>
            <ChartContainer config={chartConfig} className="h-[280px] w-full">
              <BarChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: 5, bottom: 0 }}
              >
                <CartesianGrid
                  vertical={false}
                  className="stroke-neutral-200 dark:stroke-neutral-700"
                />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                  className="fill-neutral-500 text-xs"
                  interval={0}
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickCount={5}
                  tickFormatter={(value: number) =>
                    value >= 1000
                      ? `${(value / 1000).toFixed(0)}k`
                      : value.toLocaleString()
                  }
                  className="fill-neutral-500 text-xs"
                />
                <ChartTooltip
                  cursor={{ fill: "rgba(255,255,255,0.05)" }}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => value}
                      formatter={(value) => [
                        `${Number(value).toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })} ${toCurrency}`,
                        `${effectiveAmount.toLocaleString()} ${fromCurrency} →`,
                      ]}
                      indicator="dot"
                    />
                  }
                />
                <Bar dataKey="convertedAmount" radius={[6, 6, 0, 0]}>
                  {monthlyData.map((entry, index) => (
                    <Cell key={index} fill={getBarColor(entry.convertedAmount)} />
                  ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          </SlideUp>

          {/* Legend hint */}
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-green-400" />
              <span>Above average</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-red-400" />
              <span>Below average</span>
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!isLoading && (!monthlyData || monthlyData.length === 0) && fromCurrency !== toCurrency && (
        <div className="text-center py-12 text-neutral-500">
          <p className="text-lg">No data available</p>
          <p className="text-sm mt-1">Try a different currency pair.</p>
        </div>
      )}

      {fromCurrency === toCurrency && (
        <div className="text-center py-12 text-neutral-500">
          <p className="text-lg">Select different currencies</p>
          <p className="text-sm mt-1">The source and target currencies must be different.</p>
        </div>
      )}
    </div>
  );
};

export default RecurringTracker;
