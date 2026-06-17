'use client'

import { useRates } from "@/hooks/useRates";
import { InfiniteSlider } from "./motion";

const LiveMarkets = () => {
  const { data, isLoading, isError } = useRates('USD');

  return (
    <div className="w-full flex items-stretch overflow-hidden bg-neutral-700 h-12">
      <div className="px-3 bg-lime-500 flex items-center whitespace-nowrap text-preset text-neutral-900 z-10 relative font-bold">
        • LIVE MARKETS
      </div>
      
      {isLoading && (
        <div className="flex-1 flex items-center px-4 text-preset text-neutral-200">
          Loading rates...
        </div>
      )}
      
      {isError && (
        <div className="flex-1 flex items-center px-4 text-preset text-red-500">
          Failed to load rates
        </div>
      )}
      
      {!isLoading && !isError && data && Array.isArray(data) && data.length > 0 && (
        <InfiniteSlider speed={6}>
          {data.map((item) => (
            <div 
              key={item.quote} 
              className="px-6 border-r border-r-neutral-500 bg-neutral-700 flex items-center text-preset gap-2 h-full whitespace-nowrap"
            >
              <span className="text-neutral-200">USD/{item.quote}</span>
              <span className="text-neutral-50 font-mono">{item.rate.toFixed(4)}</span>
            </div>
          ))}
        </InfiniteSlider>
      )}
    </div>
  );
};

export default LiveMarkets;