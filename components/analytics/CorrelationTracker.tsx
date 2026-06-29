import React, { useState, useMemo } from "react";
import { useCorrelationData } from "@/hooks/useCorrelationData";
import { calculatePearsonCorrelation } from "@/lib/correlation";
import { ShimmerBlock } from "@/components/Motion";
import { IoMdArrowDropdown } from "react-icons/io";

const POPULAR_BASES = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD"];

interface CorrelationPair {
  pair: string; // e.g. "EUR & GBP"
  correlation: number;
}

const CorrelationTracker = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const { data: timeseriesData, isLoading } = useCorrelationData(baseCurrency);

  const correlationResults = useMemo(() => {
    if (!timeseriesData) return { highPos: [], highNeg: [] };

    const keys = Object.keys(timeseriesData);
    const results: CorrelationPair[] = [];

    // Calculate correlation between every unique pair in the basket
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        const keyA = keys[i];
        const keyB = keys[j];
        const seriesA = timeseriesData[keyA];
        const seriesB = timeseriesData[keyB];

        const correlation = calculatePearsonCorrelation(seriesA, seriesB);
        
        if (!isNaN(correlation)) {
          results.push({
            pair: `${keyA} & ${keyB}`,
            correlation
          });
        }
      }
    }

    // Sort by absolute correlation to find strongest relationships
    const sorted = [...results].sort((a, b) => b.correlation - a.correlation);
    
    // Top Positive Correlations (Closer to +1)
    const highPos = sorted.filter(r => r.correlation > 0.5).slice(0, 5);
    
    // Top Negative Correlations (Closer to -1)
    const highNeg = [...results].sort((a, b) => a.correlation - b.correlation).filter(r => r.correlation < -0.5).slice(0, 5);

    return { highPos, highNeg };
  }, [timeseriesData]);

  if (isLoading || !timeseriesData) {
    return (
      <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 min-h-[300px] lg:col-span-2">
        <ShimmerBlock width="200px" height="24px" rounded="4px" />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <ShimmerBlock width="100%" height="40px" rounded="8px" />
            <ShimmerBlock width="100%" height="40px" rounded="8px" />
          </div>
          <div className="flex flex-col gap-4">
            <ShimmerBlock width="100%" height="40px" rounded="8px" />
            <ShimmerBlock width="100%" height="40px" rounded="8px" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 min-h-[300px] lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-neutral-50">90-Day Correlation Tracker</h3>
          <p className="text-neutral-400 text-[13px] leading-relaxed mt-1">
            Identifies which currency pairs tend to move together (positive) or in opposite directions (inverse) against the base.
          </p>
        </div>
        
        <div className="relative shrink-0 ml-4">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Positive Correlation */}
        <div>
          <h4 className="text-xs font-bold text-green-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span>Highly Correlated</span>
            <span className="text-neutral-500 font-normal lowercase">(Move together)</span>
          </h4>
          <div className="flex flex-col gap-2">
            {correlationResults.highPos.length === 0 ? (
              <p className="text-sm text-neutral-500 italic">No strong positive correlations found in this window.</p>
            ) : (
              correlationResults.highPos.map((item, index) => (
                <div key={item.pair} className="bg-neutral-700/50 rounded-lg p-3 flex items-center justify-between border border-neutral-600/50">
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-500 font-bold w-4 text-xs">{index + 1}</span>
                    <span className="text-neutral-50 font-medium">{item.pair}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-bold text-sm">+{item.correlation.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Negative Correlation */}
        <div>
          <h4 className="text-xs font-bold text-orange-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span>Inversely Correlated</span>
            <span className="text-neutral-500 font-normal lowercase">(Move opposite)</span>
          </h4>
          <div className="flex flex-col gap-2">
            {correlationResults.highNeg.length === 0 ? (
              <p className="text-sm text-neutral-500 italic">No strong inverse correlations found in this window.</p>
            ) : (
              correlationResults.highNeg.map((item, index) => (
                <div key={item.pair} className="bg-neutral-700/50 rounded-lg p-3 flex items-center justify-between border border-neutral-600/50">
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-500 font-bold w-4 text-xs">{index + 1}</span>
                    <span className="text-neutral-50 font-medium">{item.pair}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-orange-400 font-bold text-sm">{item.correlation.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationTracker;
