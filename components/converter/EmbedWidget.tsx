"use client";

import React, { useState, useEffect } from "react";
import { useCurrencies } from "@/hooks/useCurrencies";
import { useRates } from "@/hooks/useRates";
import { IoMdSwap } from "react-icons/io";

interface EmbedWidgetProps {
  initialFrom: string;
  initialTo: string;
  initialAmount: string;
}

const formatWithCommas = (value: string) => {
  const parts = value.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const parseCommas = (value: string) => value.replace(/,/g, "");

export default function EmbedWidget({ initialFrom, initialTo, initialAmount }: EmbedWidgetProps) {
  const [fromCurrency, setFromCurrency] = useState(initialFrom);
  const [toCurrency, setToCurrency] = useState(initialTo);
  const [amount, setAmount] = useState(initialAmount);
  const [displayAmount, setDisplayAmount] = useState(formatWithCommas(initialAmount));

  const { data: currencies, isLoading: currenciesLoading } = useCurrencies();
  const { data: rates, isLoading: ratesLoading } = useRates([fromCurrency]);

  const currencyOptions = currencies ? Object.keys(currencies).sort() : [];

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getRawCalculatedNumber = () => {
    if (!amount || isNaN(Number(amount))) return 0;
    if (fromCurrency === toCurrency) return Number(amount);

    const rateItem = rates?.find(
      (r) => r.base === fromCurrency && r.quote === toCurrency
    );
    if (!rateItem) return 0;

    return Number(amount) * rateItem.rate;
  };

  const getCalculatedString = () => {
    const val = getRawCalculatedNumber();
    if (val === 0) return "0.00";
    return val.toLocaleString(undefined, {
      minimumFractionDigits: fromCurrency === toCurrency ? 2 : 4,
      maximumFractionDigits: fromCurrency === toCurrency ? 2 : 4,
    });
  };

  if (currenciesLoading) {
    return (
      <div className="w-full h-full p-4 bg-neutral-900 text-neutral-50 flex items-center justify-center font-mono text-sm">
        Loading rates...
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-neutral-900 text-neutral-50 p-4 font-sans flex flex-col justify-between" style={{ margin: 0, overflow: "hidden" }}>
      <div className="bg-neutral-800 rounded-xl p-3 border border-neutral-700 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 bg-neutral-700 p-2 rounded-lg border border-neutral-600">
          <input
            type="text"
            value={displayAmount}
            onChange={(e) => {
              const val = e.target.value;
              const rawValue = parseCommas(val);
              if (/^\d*\.?\d*$/.test(rawValue)) {
                setDisplayAmount(formatWithCommas(rawValue));
                setAmount(rawValue);
              }
            }}
            className="w-full bg-transparent outline-none text-xl font-bold text-neutral-50 min-w-0"
            placeholder="0.00"
          />
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="bg-neutral-600 text-sm font-medium text-neutral-50 px-2 py-1 rounded cursor-pointer outline-none border border-neutral-500"
          >
            {currencyOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-center -my-3 relative z-10 pointer-events-none">
          <button 
            onClick={handleSwap}
            className="bg-lime-500 text-black p-1.5 rounded-full border-2 border-neutral-800 pointer-events-auto hover:bg-lime-400 transition-colors"
          >
            <IoMdSwap size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between gap-2 bg-neutral-700 p-2 rounded-lg border border-neutral-600">
          <div className="w-full bg-transparent outline-none text-xl font-bold text-lime-500 truncate min-w-0">
            {ratesLoading ? "..." : getCalculatedString()}
          </div>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="bg-neutral-600 text-sm font-medium text-neutral-50 px-2 py-1 rounded cursor-pointer outline-none border border-neutral-500"
          >
            {currencyOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <a 
          href={`/?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] text-neutral-400 hover:text-lime-500 transition-colors"
        >
          Powered by FX Checker
        </a>
      </div>
    </div>
  );
}
