'use client'

import React, { useState } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { HiArrowsUpDown } from "react-icons/hi2";
import { useCurrencies } from "@/hooks/useCurrencies";
import { useRates } from "@/hooks/useRates";

const getFlagEmoji = (currencyCode: string) => {
  if (currencyCode === 'EUR') return '🇪🇺';
  const countryCode = currencyCode.substring(0, 2);
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const formatWithCommas = (value: string) => {
  const parts = value.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const parseCommas = (value: string) => value.replace(/,/g, '');

const Converter = () => {
  const [amount, setAmount] = useState<string>("1000");
  const [displayAmount, setDisplayAmount] = useState<string>("1,000");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [dropdownOpen, setDropdownOpen] = useState<'from' | 'to' | null>(null);

  const { data: currencies } = useCurrencies();
  const { data: rates } = useRates([fromCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getConvertedAmount = () => {
    if (!amount || isNaN(Number(amount))) return "0.00";
    if (fromCurrency === toCurrency) return Number(amount).toFixed(2);
    
    const rateItem = rates?.find(r => r.base === fromCurrency && r.quote === toCurrency);
    if (!rateItem) return "---";

    return (Number(amount) * rateItem.rate).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const CurrencyDropdown = ({ type, current }: { type: 'from' | 'to', current: string }) => {
    if (dropdownOpen !== type || !currencies) return null;

    return (
      <>
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(null)} />
        <div className="absolute top-full right-0 mt-2 w-64 max-h-64 overflow-y-auto bg-neutral-600 border border-neutral-500 rounded-xl z-50 shadow-2xl flex flex-col p-2 gap-1 custom-scrollbar">
          {Object.entries(currencies).map(([code, name]) => (
            <button
              key={code}
              onClick={() => {
                if (type === 'from') setFromCurrency(code);
                else setToCurrency(code);
                setDropdownOpen(null);
              }}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-500 transition-colors text-left w-full"
            >
              <span className="text-2xl leading-none">{getFlagEmoji(code)}</span>
              <span className="font-bold text-neutral-50 min-w-[3ch]">{code}</span>
              <span className="text-sm text-neutral-300 truncate">{name}</span>
            </button>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-[20px] font-normal text-neutral-50">
        CHECK THE RATE
      </h2>
      <div className="bg-neutral-700 rounded-[20px] p-4 space-y-4 flex flex-col items-center justify-center w-full">
        <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full">
          <h4 className="text-neutral-100 font-normal text-sm">SEND</h4>
          <div className="flex items-center justify-between">
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
              className="font-bold text-[32px] text-neutral-50 bg-transparent outline-none w-1/2 min-w-0 placeholder-neutral-400"
              placeholder="0.00"
            />
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(dropdownOpen === 'from' ? null : 'from')}
                className="p-[10px] rounded-[8px] bg-neutral-500 border border-neutral-400 flex items-center gap-2 hover:bg-neutral-400 transition-colors"
              >
                <div className="text-xl leading-none">{getFlagEmoji(fromCurrency)}</div>
                <span className="font-normal text-sm text-neutral-50">{fromCurrency}</span>
                <IoMdArrowDropdown className="text-neutral-50" />
              </button>
              <CurrencyDropdown type="from" current={fromCurrency} />
            </div>
          </div>
        </div>
        
        <button 
          onClick={handleSwap}
          className="w-[48px] h-[48px] rounded-[8px] bg-neutral-600 border border-neutral-500 flex items-center justify-center hover:bg-neutral-500 transition-colors"
        >
          <HiArrowsUpDown size={20} className="text-neutral-50" />
        </button>
        
        <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full">
          <h4 className="text-neutral-100 font-normal text-sm">RECEIVE</h4>
          <div className="flex items-center justify-between">
            <span className="font-bold text-[32px] text-lime-500 truncate w-1/2 min-w-0">
              {getConvertedAmount()}
            </span>
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(dropdownOpen === 'to' ? null : 'to')}
                className="p-[10px] rounded-[8px] bg-neutral-500 border border-neutral-400 flex items-center gap-2 hover:bg-neutral-400 transition-colors"
              >
                <div className="text-xl leading-none">{getFlagEmoji(toCurrency)}</div>
                <span className="font-normal text-sm text-neutral-50">{toCurrency}</span>
                <IoMdArrowDropdown className="text-neutral-50" />
              </button>
              <CurrencyDropdown type="to" current={toCurrency} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
