import { useState } from "react";
import { RiArrowDropUpFill, RiArrowDropDownFill } from "react-icons/ri";
import { AnimatePresence } from "framer-motion";
import HistoryChart from "../HistoryChart";
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

const History = () => {
  const [activeDate, setActiveDate] = useState("1M");
  const base = "USD";
  const quote = "EUR";

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
    <div className="w-full max-w-[1036px] mx-auto">
      {/* Summary Cards */}
      <div className="w-full lg:flex lg:items-center lg:justify-between">
        <div className="w-full gap-2.5 mt-4 px-4 lg:max-w-[700px]">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <SlideUp key={`skeleton-${i}`} delay={i * 0.05} distance={20}>
                <div className="bg-neutral-700 border border-neutral-600 rounded-2xl px-5 py-3 gap-4">
                  <ShimmerBlock width="60px" height="14px" rounded="4px" />
                  <div className="mt-2">
                    <ShimmerBlock width="100px" height="24px" rounded="4px" />
                  </div>
                </div>
              </SlideUp>
            ))
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
          <div className="px-4 mt-5.5">
            <div className="bg-neutral-700 border-sm flex items-center w-fit relative">
              {datePicker.map((date) => (
                <button
                  className="border-sm px-4 py-3 relative z-10"
                  onClick={() => setActiveDate(date)}
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

      {/* Chart */}
      <SlideUp delay={0.3} distance={20}>
        <div className="px-4 mt-4 pb-8">
          <div className="bg-neutral-700 border border-neutral-600 rounded-2xl px-3 py-4">
            <div className="w-full flex items-center justify-between">
              <p className="text-neutral-50 font-medium text-base">
                {base}/{quote}
              </p>
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
                  key={`chart-${activeDate}`}
                  delay={0.1}
                  duration={0.7}
                >
                  <HistoryChart data={history?.data ?? []} />
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
