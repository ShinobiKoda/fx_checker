"use client";

import { useRates } from "@/hooks/useRates";
import { InfiniteSlider, ShimmerBlock, FadeIn, ErrorBanner } from "./Motion";
import { IoMdArrowDown, IoMdArrowUp } from "react-icons/io";

const LiveMarkets = () => {
  const { data, isLoading, isError, refetch } = useRates(["USD", "EUR", "GBP"]);

  return (
    <FadeIn delay={0.2} duration={0.5}>
      <div className="w-full flex items-stretch overflow-hidden backdrop-blur-[2px] bg-neutral-700/60 border-b border-white/5 h-12 fixed top-14 left-0 z-40">
        <div className="px-3 bg-lime-500 flex items-center whitespace-nowrap text-preset text-black z-10 relative font-medium md:text-[12px]">
          • LIVE MARKETS
        </div>

        {isLoading && (
          <div className="flex-1 flex items-center gap-4 px-4">
            <ShimmerBlock width="100px" height="16px" rounded="4px" />
            <ShimmerBlock width="80px" height="16px" rounded="4px" />
            <ShimmerBlock width="110px" height="16px" rounded="4px" />
            <ShimmerBlock width="90px" height="16px" rounded="4px" />
            <ShimmerBlock width="100px" height="16px" rounded="4px" />
          </div>
        )}

        {isError && (
          <div className="flex-1 flex items-center px-4">
            <button
              onClick={() => refetch()}
              className="text-red-400 text-xs hover:text-red-300 transition-colors flex items-center gap-2"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Failed to load rates — Tap to retry
            </button>
          </div>
        )}

        {!isLoading &&
          !isError &&
          data &&
          Array.isArray(data) &&
          data.length > 0 && (
            <InfiniteSlider speed={40}>
              {data.map((item) => (
                <div
                  key={`${item.base}-${item.quote}`}
                  className="px-6 border-r border-r-neutral-500 bg-neutral-700 flex items-center text-preset gap-2 h-full whitespace-nowrap md:text-[12px]"
                >
                  <span className="text-neutral-200">
                    {item.base}/{item.quote}
                  </span>
                  <span className="text-neutral-50 font-mono">
                    {item.rate.toFixed(4)}
                  </span>
                  {item.direction === "up" && (
                    <div className="flex items-center text-green-500 gap-0.5">
                      <IoMdArrowUp size={16} />
                      <span className="font-mono text-xs">{item.change}%</span>
                    </div>
                  )}
                  {item.direction === "down" && (
                    <div className="flex items-center text-red-500 gap-0.5">
                      <IoMdArrowDown size={16} />
                      <span className="font-mono text-xs">
                        {Math.abs(item.change)}%
                      </span>
                    </div>
                  )}
                  {item.direction === "flat" && (
                    <div className="flex items-center text-neutral-400 gap-0.5">
                      <span className="font-mono text-xs">0.00%</span>
                    </div>
                  )}
                </div>
              ))}
            </InfiniteSlider>
          )}
      </div>
    </FadeIn>
  );
};

export default LiveMarkets;
