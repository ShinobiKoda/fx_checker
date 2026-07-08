"use client";

import { useState } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import { LuTrash, LuBellRing } from "react-icons/lu";
import { useRateAlerts, useAddRateAlert, useRemoveRateAlert } from "@/hooks/useRateAlerts";
import { SlideInRow, StaggerContainer, ShimmerBlock, ErrorBanner, PulseIndicator } from "@/components/Motion";
import { getShortRelativeTime } from "@/lib/utils";
import { CurrencySelect } from "@/components/ui/CurrencySelect";

interface AlertsProps {
  base: string;
  quote: string;
}

const Alerts = ({ base, quote }: AlertsProps) => {
  const { data: alerts, isLoading, isError, refetch } = useRateAlerts();
  const { mutate: addAlert, isPending: isAdding } = useAddRateAlert();
  const { mutate: removeAlert } = useRemoveRateAlert();

  const [fromCurrency, setFromCurrency] = useState(base);
  const [toCurrency, setToCurrency] = useState(quote);
  const [targetRate, setTargetRate] = useState<string>("");
  const [condition, setCondition] = useState<'above' | 'below'>('above');

  const handleSetAlert = () => {
    if (!targetRate || isNaN(Number(targetRate))) return;
    addAlert({
      from: fromCurrency,
      to: toCurrency,
      targetRate: Number(targetRate),
      condition
    }, {
      onSuccess: () => setTargetRate("")
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-[1036px] mx-auto pb-8 md:pb-[48px] px-4">
        <div className="px-4 py-5 rounded-[16px] bg-neutral-700 border border-neutral-600 space-y-4">
          <ShimmerBlock height="120px" rounded="10px" />
          <ShimmerBlock height="60px" rounded="10px" />
          <ShimmerBlock height="60px" rounded="10px" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full max-w-[1036px] mx-auto pb-8 md:pb-[48px] px-4">
        <ErrorBanner message="Failed to load rate alerts" onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1036px] mx-auto pb-8 md:pb-[48px] px-4 ">
      <div className="px-4 py-5 rounded-[16px] bg-neutral-700 border border-neutral-600">
        
        {/* Create Alert Form */}
        <div className="mb-8 p-4 rounded-[12px] bg-neutral-600 border dark:border-neutral-500 border-neutral-300">
          <h4 className="font-medium text-sm text-neutral-50 mb-4 flex items-center gap-2">
            <LuBellRing className="dark:text-lime-500 text-lime-700" />
            CREATE NEW ALERT
          </h4>
          
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <CurrencySelect
                value={fromCurrency}
                onChange={setFromCurrency}
                className="bg-neutral-700 border dark:border-neutral-500 border-neutral-400 text-neutral-50 text-sm rounded-md px-3 py-2 outline-none w-full md:w-auto cursor-pointer"
              />
              <MdOutlineArrowRightAlt className="text-neutral-400 shrink-0" />
              <CurrencySelect
                value={toCurrency}
                onChange={setToCurrency}
                className="bg-neutral-700 border dark:border-neutral-500 border-neutral-400 text-neutral-50 text-sm rounded-md px-3 py-2 outline-none w-full md:w-auto cursor-pointer"
              />
            </div>

            <div className="flex items-center bg-neutral-700 border dark:border-neutral-500 border-neutral-400 rounded-md p-1 w-full md:w-auto">
              <button 
                onClick={() => setCondition('below')}
                className={`px-3 py-1 text-sm rounded-sm transition-colors w-1/2 md:w-auto ${condition === 'below' ? 'bg-neutral-500 text-neutral-50' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                Below
              </button>
              <button 
                onClick={() => setCondition('above')}
                className={`px-3 py-1 text-sm rounded-sm transition-colors w-1/2 md:w-auto ${condition === 'above' ? 'bg-neutral-500 text-neutral-50' : 'text-neutral-400 hover:text-neutral-200'}`}
              >
                Above
              </button>
            </div>

            <div className="flex items-center w-full md:w-auto gap-4">
              <input 
                type="number"
                placeholder="Target rate"
                value={targetRate}
                onChange={(e) => setTargetRate(e.target.value)}
                className="bg-neutral-700 border dark:border-neutral-500 border-neutral-400 text-neutral-50 text-sm rounded-md px-3 py-2 outline-none w-full md:w-[120px] placeholder-neutral-400"
              />
              <button 
                onClick={handleSetAlert}
                disabled={isAdding || !targetRate}
                className="font-medium text-[12px] px-4 py-2.5 rounded-md bg-lime-500 text-black hover:bg-lime-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
              >
                {isAdding ? "SETTING..." : "SET ALERT"}
              </button>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        <div className="md:flex md:items-center md:justify-between mb-5">
          <h3 className="font-medium text-base text-neutral-50">
            ACTIVE ALERTS
          </h3>
          <h5 className="font-normal text-[12px] text-neutral-50 opacity-70 mt-2 md:mt-0">
            {alerts?.length || 0} CONFIGURED
          </h5>
        </div>
        
        {(!alerts || alerts.length === 0) ? (
          <div className="bg-neutral-600 border dark:border-neutral-500 border-neutral-300 p-12 rounded-[12px] flex flex-col items-center justify-center text-center text-neutral-400">
            <LuBellRing className="w-12 h-12 mb-4 opacity-30" />
            <p className="font-medium text-neutral-200">No alerts set</p>
            <p className="text-sm mt-1 max-w-[250px]">Get notified when a currency pair crosses your target rate.</p>
          </div>
        ) : (
          <StaggerContainer staggerDelay={0.05} className="space-y-3">
            {alerts.map((alert) => (
              <SlideInRow key={alert.id}>
                <div className="p-3 rounded-[10px] bg-neutral-600 border dark:border-neutral-500 border-neutral-300 flex flex-wrap items-center justify-between gap-3 group hover:bg-neutral-500/50 transition-colors">
                  <div className="flex flex-col md:flex-row md:gap-5 md:items-center min-w-0">
                    <p className="text-[12px] font-normal text-neutral-400 w-[40px]">
                      {getShortRelativeTime(alert.created_at)}
                    </p>
                    <div className="flex items-center gap-3 mt-1 md:mt-0">
                      <p className="flex items-center font-medium text-sm text-neutral-50">
                        <span>{alert.from_currency}</span>
                        <MdOutlineArrowRightAlt className="text-neutral-400 mx-1" />
                        <span>{alert.to_currency}</span>
                      </p>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-sm uppercase ${alert.condition === 'above' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                        {alert.condition}
                      </span>
                      <span className="font-bold text-sm text-neutral-50">
                        {alert.target_rate}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 md:gap-4 shrink-0 ml-auto">
                    <div className={`flex items-center gap-1 text-[10px] uppercase font-medium px-1.5 py-0.5 md:px-2 md:py-1 rounded-full border whitespace-nowrap ${alert.triggered ? 'border-green-500/30 text-green-500 bg-green-500/10' : 'dark:border-neutral-500 border-neutral-400 text-neutral-300 bg-neutral-700'}`}>
                      {!alert.triggered && <PulseIndicator colorClass="bg-amber-500" />}
                      {alert.triggered ? 'TRIGGERED' : 'WATCHING'}
                    </div>
                    
                    <button 
                      onClick={() => removeAlert(alert.id)}
                      className="flex items-center justify-center h-7 w-7 md:h-8 md:w-8 shrink-0 bg-neutral-700 border dark:border-neutral-500 border-neutral-400 cursor-pointer radius-sm text-neutral-400 hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                      title="Delete alert"
                    >
                      <LuTrash />
                    </button>
                  </div>
                </div>
              </SlideInRow>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
};

export default Alerts;
