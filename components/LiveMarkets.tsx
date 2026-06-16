'use client'

import { useRates } from "@/hooks/useRates";
import { InfiniteSlider } from "./motion";

const LiveMarkets = () => {
  const { data, isLoading, isError } = useRates('USD');

  return (
    <div className="w-full flex items-stretch overflow-hidden bg-neutral-700">
      <div className="px-2 py-3 bg-lime-500 flex items-center whitespace-nowrap text-preset text-neutral-900 z-10 relative">
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
      
      {!isLoading && !isError && data?.rates && (
        <InfiniteSlider speed={40}>
          <div className="flex items-stretch h-full">
            {Object.entries(data.rates).map(([currency, rate]) => (
              <div 
                key={currency} 
                className="border px-4 py-3 border-r-neutral-500 bg-neutral-700 flex items-center text-preset gap-2 h-full whitespace-nowrap"
              >
                <span className="text-neutral-200">USD/{currency}</span>
                <span className="text-neutral-50">{rate.toFixed(4)}</span>
              </div>
            ))}
          </div>
        </InfiniteSlider>
      )}
    </div>
  );
};

export default LiveMarkets;
