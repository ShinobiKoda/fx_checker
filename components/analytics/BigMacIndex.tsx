import React, { useState } from "react";
import { useRates } from "@/hooks/useRates";
import { BIG_MAC_DATA, calculateBigMacValuation } from "@/lib/bigMacData";
import { ShimmerBlock } from "@/components/Motion";
import { motion } from "framer-motion";
import { IoMdArrowDropdown } from "react-icons/io";

const BigMacIndex = () => {
  const [selectedCurrency, setSelectedCurrency] = useState("EUR");
  const { data: rates, isLoading } = useRates(["USD"]);

  if (isLoading || !rates) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 min-h-[300px]">
        <ShimmerBlock width="150px" height="24px" rounded="4px" />
        <div className="mt-6 flex flex-col gap-4">
          <ShimmerBlock width="100%" height="40px" rounded="8px" />
          <ShimmerBlock width="100%" height="120px" rounded="8px" />
        </div>
      </div>
    );
  }

  // Get current rate of selected currency against USD
  const rateItem = rates.find(r => r.base === "USD" && r.quote === selectedCurrency);
  const currentRate = rateItem?.rate || 1;
  const bigMacInfo = BIG_MAC_DATA[selectedCurrency];

  const { impliedPPP, valuation } = calculateBigMacValuation(bigMacInfo.localPrice, currentRate);
  
  const isOvervalued = valuation > 0;
  const absValuation = Math.abs(valuation);

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 min-h-[300px] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-neutral-50">Big Mac Index</h3>
          
          <div className="relative">
            <select
              value={selectedCurrency}
              onChange={(e) => setSelectedCurrency(e.target.value)}
              className="appearance-none bg-neutral-700 border border-neutral-600 text-neutral-50 text-sm py-1.5 pl-3 pr-8 rounded-lg outline-none focus:border-lime-500 transition-colors"
            >
              {Object.keys(BIG_MAC_DATA).map(code => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <IoMdArrowDropdown className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
          </div>
        </div>

        <p className="text-neutral-400 text-[13px] leading-relaxed mb-6">
          The Big Mac index was invented by The Economist in 1986 as a lighthearted guide to whether currencies are at their "correct" level based on Purchasing Power Parity (PPP).
        </p>

        <div className="bg-neutral-700/50 rounded-xl p-4 border border-neutral-600">
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold text-neutral-50">{absValuation.toFixed(1)}%</span>
            <span className={`text-lg font-medium mb-1 ${isOvervalued ? "text-red-400" : "text-green-400"}`}>
              {isOvervalued ? "Overvalued" : "Undervalued"}
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            A Big Mac costs {bigMacInfo.localPrice} {selectedCurrency} locally and $5.69 in the US. 
            The implied exchange rate is {impliedPPP.toFixed(2)}. The difference between this and the actual exchange rate ({currentRate.toFixed(2)}) suggests the {selectedCurrency} is {isOvervalued ? "overvalued" : "undervalued"} by {absValuation.toFixed(1)}%.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs text-neutral-500 font-medium mb-2">
          <span>-50% Undervalued</span>
          <span>Fair Value</span>
          <span>+50% Overvalued</span>
        </div>
        <div className="h-2 w-full bg-neutral-700 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-neutral-500 z-10" />
          {/* Indicator Bar */}
          <motion.div
            initial={{ width: 0, x: isOvervalued ? "100%" : "0%" }}
            animate={{ 
              width: `${Math.min(absValuation, 50)}%`,
              left: isOvervalued ? '50%' : 'auto',
              right: isOvervalued ? 'auto' : '50%'
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className={`h-full absolute top-0 bottom-0 ${isOvervalued ? 'bg-red-500' : 'bg-green-500'}`}
          />
        </div>
      </div>
    </div>
  );
};

export default BigMacIndex;
