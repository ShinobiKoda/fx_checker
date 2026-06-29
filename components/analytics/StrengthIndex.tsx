import React, { useState } from "react";
import { useCurrencyStrength } from "@/hooks/useCurrencyStrength";
import { ShimmerBlock } from "@/components/Motion";
import { IoMdArrowDropdown } from "react-icons/io";

const POPULAR_BASES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD"];

const StrengthIndex = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const { data: strengthData, isLoading } = useCurrencyStrength(baseCurrency);

  if (isLoading || !strengthData) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 min-h-[300px]">
        <ShimmerBlock width="150px" height="24px" rounded="4px" />
        <div className="mt-6 flex flex-col gap-4">
          <ShimmerBlock width="100%" height="40px" rounded="8px" />
          <ShimmerBlock width="100%" height="40px" rounded="8px" />
          <ShimmerBlock width="100%" height="40px" rounded="8px" />
        </div>
      </div>
    );
  }

  // Filter out the base currency itself if it exists, and slice top 5 gainers and bottom 5 losers
  const filteredData = strengthData.filter(d => d.quote !== baseCurrency);
  const gainers = filteredData.slice(0, 5);
  const losers = filteredData.slice(-5).reverse(); // Worst performers first

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 min-h-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-neutral-50">Currency Strength</h3>
        
        <div className="relative">
          <select
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
            className="appearance-none bg-neutral-700 border border-neutral-600 text-neutral-50 text-sm py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-lime-500 transition-colors"
          >
            {POPULAR_BASES.map(code => (
              <option key={code} value={code}>{code}</option>
            ))}
          </select>
          <IoMdArrowDropdown className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
        </div>
      </div>

      <p className="text-neutral-400 text-[13px] leading-relaxed mb-6">
        Ranked performance of global currencies against the {baseCurrency} over the last trading period.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gainers */}
        <div>
          <h4 className="text-xs font-bold text-green-400 mb-3 uppercase tracking-wider">Top Gainers (Strongest)</h4>
          <div className="flex flex-col gap-2">
            {gainers.map((item, index) => (
              <div key={item.quote} className="bg-neutral-700/50 rounded-lg p-3 flex items-center justify-between border border-neutral-600/50">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500 font-bold w-4 text-xs">{index + 1}</span>
                  <span className="text-neutral-50 font-medium">{item.quote}</span>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-bold text-sm">+{item.percentChange.toFixed(2)}%</div>
                  <div className="text-neutral-400 text-[10px]">{item.last.toFixed(4)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Losers */}
        <div>
          <h4 className="text-xs font-bold text-red-400 mb-3 uppercase tracking-wider">Top Losers (Weakest)</h4>
          <div className="flex flex-col gap-2">
            {losers.map((item, index) => (
              <div key={item.quote} className="bg-neutral-700/50 rounded-lg p-3 flex items-center justify-between border border-neutral-600/50">
                <div className="flex items-center gap-3">
                  <span className="text-neutral-500 font-bold w-4 text-xs">{index + 1}</span>
                  <span className="text-neutral-50 font-medium">{item.quote}</span>
                </div>
                <div className="text-right">
                  <div className="text-red-400 font-bold text-sm">{item.percentChange.toFixed(2)}%</div>
                  <div className="text-neutral-400 text-[10px]">{item.last.toFixed(4)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrengthIndex;
