import React, { useState, useMemo } from "react";
import { useCorrelationData } from "@/hooks/useCorrelationData";
import { calculatePearsonCorrelation } from "@/lib/correlation";
import { ShimmerBlock } from "@/components/Motion";
import { CurrencySelect } from "@/components/ui/CurrencySelect";

interface CorrelationPair {
  pair: string;
  correlation: number;
}

const CorrelationTracker = () => {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const { data: timeseriesData, isLoading } = useCorrelationData(baseCurrency);

  const correlationResults = useMemo(() => {
    if (!timeseriesData) return { highPos: [], highNeg: [] };

    const keys = Object.keys(timeseriesData);
    const results: CorrelationPair[] = [];

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

    const sorted = [...results].sort((a, b) => b.correlation - a.correlation);
    const highPos = sorted.filter(r => r.correlation > 0.5).slice(0, 5);
    const highNeg = [...results].sort((a, b) => a.correlation - b.correlation).filter(r => r.correlation < -0.5).slice(0, 5);

    return { highPos, highNeg };
  }, [timeseriesData]);

  if (isLoading || !timeseriesData) {
    return (
      <div className="bg-neutral-700 border border-neutral-600 rounded-2xl p-5 min-h-[300px] lg:col-span-2">
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
    <div className="bg-neutral-700 border border-neutral-600 rounded-2xl p-5 min-h-[300px] lg:col-span-2">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-neutral-50">90-Day Correlation Tracker</h3>
          <p className="text-neutral-200 text-[13px] leading-relaxed mt-1">
            Identifies which currency pairs tend to move together (positive) or in opposite directions (inverse) against the base.
          </p>
        </div>
        
        <div className="relative shrink-0 md:ml-4">
          <CurrencySelect
            value={baseCurrency}
            onChange={setBaseCurrency}
            className="appearance-none bg-neutral-600 border border-neutral-500 text-neutral-50 text-sm py-1.5 px-3 rounded-lg outline-none focus:border-lime-500 transition-colors"
            align="right"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
        {/* Positive Correlation */}
        <div>
          <h4 className="text-xs font-bold dark:text-green-400 text-green-600 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span>Highly Correlated</span>
            <span className="text-neutral-200 font-normal lowercase">(Move together)</span>
          </h4>
          <div className="flex flex-col gap-2">
            {correlationResults.highPos.length === 0 ? (
              <p className="text-sm text-neutral-200 italic">No strong positive correlations found in this window.</p>
            ) : (
              correlationResults.highPos.map((item, index) => (
                <div key={item.pair} className="bg-neutral-600/50 rounded-lg p-3 flex items-center justify-between border border-neutral-500/50">
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-200 font-bold w-4 text-xs">{index + 1}</span>
                    <span className="text-neutral-50 font-medium">{item.pair}</span>
                  </div>
                  <div className="text-right">
                    <div className="dark:text-green-400 text-green-600 font-bold text-sm">+{item.correlation.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Negative Correlation */}
        <div>
          <h4 className="text-xs font-bold dark:text-orange-400 text-orange-600 mb-3 uppercase tracking-wider flex items-center gap-2">
            <span>Inversely Correlated</span>
            <span className="text-neutral-200 font-normal lowercase">(Move opposite)</span>
          </h4>
          <div className="flex flex-col gap-2">
            {correlationResults.highNeg.length === 0 ? (
              <p className="text-sm text-neutral-200 italic">No strong inverse correlations found in this window.</p>
            ) : (
              correlationResults.highNeg.map((item, index) => (
                <div key={item.pair} className="bg-neutral-600/50 rounded-lg p-3 flex items-center justify-between border border-neutral-500/50">
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-200 font-bold w-4 text-xs">{index + 1}</span>
                    <span className="text-neutral-50 font-medium">{item.pair}</span>
                  </div>
                  <div className="text-right">
                    <div className="dark:text-orange-400 text-orange-600 font-bold text-sm">{item.correlation.toFixed(2)}</div>
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
