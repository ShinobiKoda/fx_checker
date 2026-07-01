import { useState } from "react";
import { RiArrowDropUpFill, RiArrowDropDownFill } from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
import HistoryChart from "../HistoryChart";
import { RateHeatmap } from "./RateHeatmap";
import { useHistory } from "@/hooks/useHistory";
import {
  Spinner,
  ShimmerBlock,
  SlideUp,
  FadeSlideIn,
  ActivePill,
  ChartReveal,
  StaggerContainer,
  StaggerItem,
} from "@/components/Motion";

interface HistoryProps {
  base: string;
  quote: string;
  activeDate: string;
  setActiveDate: (date: string) => void;
}

const History = ({ base, quote, activeDate, setActiveDate }: HistoryProps) => {
  const [viewMode, setViewMode] = useState<"chart" | "heatmap">("chart");

  const {
    data: history,
    isLoading,
    isError,
  } = useHistory(base, quote, activeDate);

  const datePicker = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

  const summary = history?.summary;

  const historyCards = summary
    ? [
        {
          title: "OPEN",
          value: summary.open,
          change: false,
          percentageChange: false,
        },
        {
          title: "LAST",
          value: summary.last,
          change: false,
          percentageChange: false,
        },
        {
          title: "CHANGE",
          value: summary.change,
          change: true,
          percentageChange: false,
        },
        {
          title: "% CHANGE",
          value: summary.percentChange,
          change: true,
          percentageChange: true,
        },
      ]
    : [];

  const volatilityScore = (() => {
    if (!history?.data || history.data.length < 2) return null;

    // Calculate Mean
    const mean =
      history.data.reduce((acc, val) => acc + val.rate, 0) /
      history.data.length;

    // Calculate Standard Deviation
    const variance =
      history.data.reduce((acc, val) => acc + Math.pow(val.rate - mean, 2), 0) /
      history.data.length;
    const stdDev = Math.sqrt(variance);

    // Coefficient of Variation (CV) as a percentage
    const cv = (stdDev / mean) * 100;

    if (cv > 3.5)
      return {
        label: "High Volatility",
        color: "text-red-400",
        bg: "bg-red-500/20",
        border: "border-red-500/30",
      };
    if (cv > 1.5)
      return {
        label: "Medium Volatility",
        color: "text-orange-400",
        bg: "bg-orange-500/20",
        border: "border-orange-500/30",
      };
    return {
      label: "Low Volatility",
      color: "text-green-400",
      bg: "bg-green-500/20",
      border: "border-green-500/30",
    };
  })();

  const bestDayInsight = (() => {
    if (!history?.data || history.data.length === 0) return null;

    // Group by day of week (0 = Sunday, 1 = Monday, etc.)
    const dayStats: Record<number, { sum: number; count: number }> = {};

    history.data.forEach((d) => {
      const dayOfWeek = new Date(d.date).getDay();
      if (!dayStats[dayOfWeek]) {
        dayStats[dayOfWeek] = { sum: 0, count: 0 };
      }
      dayStats[dayOfWeek].sum += d.rate;
      dayStats[dayOfWeek].count += 1;
    });

    let bestDay = -1;
    let maxAvg = -1;

    Object.entries(dayStats).forEach(([day, stats]) => {
      const avg = stats.sum / stats.count;
      if (avg > maxAvg) {
        maxAvg = avg;
        bestDay = parseInt(day);
      }
    });

    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return bestDay >= 0 ? days[bestDay] : null;
  })();

  const lastDataPoint = history?.data[history.data.length - 1];
  const lastDate = lastDataPoint
    ? new Date(lastDataPoint.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <div className="w-full max-w-259 mx-auto pb-8 md:pb-12">
      <div className="w-full lg:flex lg:items-center lg:justify-between">
        <div className="w-full gap-2.5 mt-4 px-4 lg:max-w-150">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SlideUp key={`skeleton-${i}`} delay={i * 0.05} distance={20}>
                  <div className="bg-neutral-700 border border-neutral-600 rounded-2xl px-2 py-3 flex flex-col gap-2">
                    <ShimmerBlock width="60px" height="14px" rounded="4px" />
                    <ShimmerBlock width="100px" height="24px" rounded="4px" />
                  </div>
                </SlideUp>
              ))}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <StaggerContainer
                key={activeDate}
                staggerDelay={0.06}
                className=" grid grid-cols-2 gap-2.5 md:grid-cols-4"
              >
                {historyCards.map((data, index) => (
                  <StaggerItem key={index}>
                    <div className="bg-neutral-700 border border-neutral-600 rounded-2xl px-5 py-3 gap-4">
                      <p className="font-normal text-sm text-neutral-50 opacity-70">
                        {data.title}
                      </p>
                      <div
                        className={`font-normal text-xl flex items-center ${
                          data.change
                            ? summary?.direction === "up"
                              ? "text-green-500"
                              : summary?.direction === "down"
                                ? "text-red-500"
                                : "text-neutral-50"
                            : "text-neutral-50"
                        }`}
                      >
                        {data.percentageChange &&
                          summary?.direction === "up" && (
                            <RiArrowDropUpFill size={28} />
                          )}
                        {data.percentageChange &&
                          summary?.direction === "down" && (
                            <RiArrowDropDownFill size={28} />
                          )}
                        <p>
                          {data.change && data.value > 0 ? <span>+</span> : ""}
                          {data.percentageChange
                            ? `${data.value}%`
                            : data.value}
                        </p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </AnimatePresence>
          )}
        </div>

        {/* Date Picker */}
        <SlideUp delay={0.2} distance={15}>
          <div className="px-4 mt-5.5 flex justify-start">
            <div className="bg-neutral-700 radius-sm flex items-center w-fit relative overflow-x-auto max-w-full custom-scrollbar">
              {datePicker.map((date) => (
                <button
                  className="radius-sm px-4 py-3 relative z-10 cursor-pointer"
                  onClick={() => {
                    setActiveDate(date);
                  }}
                  key={date}
                >
                  {activeDate === date && <ActivePill layoutId="datePicker" />}
                  <span className="relative z-10">{date}</span>
                </button>
              ))}
            </div>
          </div>
        </SlideUp>
      </div>

      {!isLoading &&
        bestDayInsight &&
        activeDate !== "1D" &&
        activeDate !== "1W" && (
          <SlideUp delay={0.15} distance={10}>
            <div className="px-4 mt-4">
              <div className="bg-lime-500/10 border border-lime-500/20 rounded-xl px-4 py-3 flex items-center gap-3">
                <div className="text-xl">💡</div>
                <div className="text-sm text-neutral-200">
                  <span className="font-medium text-lime-500">Pro Tip: </span>
                  Historically,{" "}
                  <span className="font-semibold text-neutral-50">
                    {bestDayInsight}
                  </span>{" "}
                  is the best day to convert {base} to {quote}.
                </div>
              </div>
            </div>
          </SlideUp>
        )}

      {/* Chart / Heatmap */}
      <SlideUp delay={0.3} distance={20}>
        <div className="px-4 mt-4 mb-4 flex justify-center">
          <div className="flex bg-neutral-700 rounded-full p-1 max-w-55 w-full border border-neutral-600">
            <button
              onClick={() => setViewMode("chart")}
              className={`flex-1 py-1.5 px-4 text-[11px] font-medium rounded-full transition-all cursor-pointer text-nowrap ${viewMode === "chart" ? "bg-lime-500 text-black shadow-sm" : "text-neutral-300 hover:text-neutral-100"}`}
            >
              Line Chart
            </button>
            <button
              onClick={() => {
                setViewMode("heatmap");
              }}
              className={`flex-1 py-1.5 px-4 text-[11px] font-medium rounded-full transition-all cursor-pointer text-nowrap ${viewMode === "heatmap" ? "bg-lime-500 text-black shadow-sm" : "text-neutral-300 hover:text-neutral-100"}`}
            >
              Heatmap
            </button>
          </div>
        </div>
        <div
          className={`px-4 pb-8 transition-all ${viewMode === "chart" ? "h-92.25 md:h-94.25" : "min-h-75"}`}
        >
          <div className="bg-neutral-700 border border-neutral-600 rounded-2xl px-3 py-4">
            <div className="w-full flex items-start justify-between mb-5">
              <div className="flex flex-col md:flex-row md:items-center items-start gap-1 md:gap-3">
                <p className="text-neutral-50 font-medium text-base leading-none mt-1">
                  {base}/{quote}
                </p>
                {volatilityScore && (
                  <div
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border leading-none ${volatilityScore.bg} ${volatilityScore.color} ${volatilityScore.border}`}
                  >
                    {volatilityScore.label}
                  </div>
                )}
              </div>
              <div className="font-normal text-[12px] opacity-70">
                {isLoading ? (
                  <ShimmerBlock width="120px" height="14px" rounded="4px" />
                ) : (
                  <FadeSlideIn keyProp={`meta-${activeDate}`} direction="right">
                    <span>{summary?.last} • </span>
                    <span>{lastDate.toUpperCase()}</span>
                  </FadeSlideIn>
                )}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <FadeSlideIn
                  keyProp="loading"
                  className="h-75 w-full flex items-center justify-center"
                >
                  <Spinner size={28} color="text-neutral-400" />
                </FadeSlideIn>
              ) : isError ? (
                <FadeSlideIn
                  keyProp="error"
                  className="h-75 w-full flex items-center justify-center"
                >
                  <p className="text-red-500 text-sm">
                    Failed to load chart data
                  </p>
                </FadeSlideIn>
              ) : (
                <ChartReveal
                  key={`chart-${activeDate}-${viewMode}`}
                  delay={0.1}
                  duration={0.7}
                >
                  {viewMode === "heatmap" ? (
                    <RateHeatmap data={history?.data ?? []} />
                  ) : (
                    <HistoryChart data={history?.data ?? []} />
                  )}
                </ChartReveal>
              )}
            </AnimatePresence>
          </div>
        </div>
      </SlideUp>
    </div>
  );
};

export default History;
