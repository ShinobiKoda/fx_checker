import { useState } from "react";
import { RiArrowDropUpFill, RiArrowDropDownFill } from "react-icons/ri";
import HistoryChart from "../HistoryChart";
import { useHistory } from "@/hooks/useHistory";
import { Spinner, ShimmerBlock } from "@/components/Motion";

const History = () => {
  const [activeDate, setActiveDate] = useState("1M");
  const base = "USD";
  const quote = "EUR";

  const { data: history, isLoading, isError } = useHistory(base, quote, activeDate);

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
    <div className="w-full">
      {/* Summary Cards */}
      <div className="w-full grid grid-cols-2 gap-2.5 mt-4 px-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                className="bg-neutral-700 border border-neutral-600 rounded-2xl px-5 py-3 gap-4"
                key={i}
              >
                <ShimmerBlock width="60px" height="14px" rounded="4px" />
                <div className="mt-2">
                  <ShimmerBlock width="100px" height="24px" rounded="4px" />
                </div>
              </div>
            ))
          : historyCards.map((data, index) => (
              <div
                className="bg-neutral-700 border border-neutral-600 rounded-2xl px-5 py-3 gap-4"
                key={index}
              >
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
            ))}
      </div>

      {/* Date Picker */}
      <div className="px-4 mt-[22px]">
        <div className="bg-neutral-700 border-sm flex items-center w-fit">
          {datePicker.map((date, index) => (
            <button
              className={` border-sm px-4 py-3 ${activeDate === date ? "bg-neutral-500" : ""}`}
              onClick={() => setActiveDate(date)}
              key={index}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
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
                <>
                  <span>{summary?.last} • </span>
                  <span>{lastDate.toUpperCase()}</span>
                </>
              )}
            </div>
          </div>
          {isLoading ? (
            <div className="h-[300px] w-full flex items-center justify-center">
              <Spinner size={28} color="text-neutral-400" />
            </div>
          ) : isError ? (
            <div className="h-[300px] w-full flex items-center justify-center">
              <p className="text-red-500 text-sm">Failed to load chart data</p>
            </div>
          ) : (
            <HistoryChart data={history?.data ?? []} />
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
