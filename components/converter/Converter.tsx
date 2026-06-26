"use client";

import React, { useState } from "react";
import { IoMdArrowDropdown, IoIosSearch } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { useCurrencies } from "@/hooks/useCurrencies";
import { useRates } from "@/hooks/useRates";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import {
  SlideUp,
  ShimmerBlock,
  SwapButton,
  ErrorBanner,
  Spinner,
  StaggerContainer,
  StaggerItem,
} from "@/components/Motion";

const getFlagEmoji = (currencyCode: string) => {
  if (currencyCode === "EUR") return "🇪🇺";
  const countryCode = currencyCode.substring(0, 2);
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const formatWithCommas = (value: string) => {
  const parts = value.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const parseCommas = (value: string) => value.replace(/,/g, "");

const POPULAR_CURRENCIES = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD"];

interface ConverterProps {
  fromCurrency: string;
  toCurrency: string;
  setFromCurrency: (c: string) => void;
  setToCurrency: (c: string) => void;
}

const Converter = ({
  fromCurrency,
  toCurrency,
  setFromCurrency,
  setToCurrency,
}: ConverterProps) => {
  const [amount, setAmount] = useState<string>("1000");
  const [displayAmount, setDisplayAmount] = useState<string>("1,000");
  const [dropdownOpen, setDropdownOpen] = useState<"from" | "to" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullAmount, setShowFullAmount] = useState(false);

  const {
    data: currencies,
    isLoading: currenciesLoading,
    isError: currenciesError,
    refetch: refetchCurrencies,
  } = useCurrencies();
  const {
    data: rates,
    isLoading: ratesLoading,
    isError: ratesError,
    isFetching: ratesFetching,
    refetch: refetchRates,
  } = useRates([fromCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getConvertedAmount = () => {
    if (!amount || isNaN(Number(amount))) return "0.0000";
    if (fromCurrency === toCurrency)
      return Number(amount).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    const rateItem = rates?.find(
      (r) => r.base === fromCurrency && r.quote === toCurrency,
    );
    if (!rateItem) return "---";

    return (Number(amount) * rateItem.rate).toLocaleString(undefined, {
      minimumFractionDigits: 4,
      maximumFractionDigits: 4,
    });
  };

  const renderCurrencyDropdown = (type: "from" | "to") => {
    if (dropdownOpen !== type || !currencies) return null;

    const filteredCurrencies = Object.entries(currencies).filter(
      ([code, name]) =>
        code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const popularCurrenciesList = filteredCurrencies.filter(([code]) =>
      POPULAR_CURRENCIES.includes(code),
    );
    const otherCurrenciesList = filteredCurrencies.filter(
      ([code]) => !POPULAR_CURRENCIES.includes(code),
    );

    const renderCurrencyItem = ([code, name]: [string, string]) => {
      const isSelected = (type === "from" ? fromCurrency : toCurrency) === code;
      return (
        <StaggerItem key={code}>
          <div className="flex items-center justify-between hover:bg-neutral-500 transition-colors px-2 py-3 rounded-lg">
            <button
              onClick={() => {
                if (type === "from") setFromCurrency(code);
                else setToCurrency(code);
                setDropdownOpen(null);
                setSearchQuery("");
              }}
              className={`flex items-center gap-3 text-left w-full`}
            >
              <span className="text-xl leading-none">{getFlagEmoji(code)}</span>
              <span className="font-normal text-neutral-50 text-sm">{code}</span>
              <span className="text-[12px] text-neutral-200 truncate">{name}</span>
            </button>
            {isSelected && <FaCheck className="text-lime-500" />}
          </div>
        </StaggerItem>
      );
    };

    return (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setDropdownOpen(null);
            setSearchQuery("");
          }}
        />
        <div
          className="absolute top-full right-0 mt-2 w-full max-w-[311px] max-h-[458px] overflow-y-auto bg-neutral-600 border border-neutral-400 border-sm z-50 shadow-2xl flex flex-col p-2 gap-1 custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full p-3 border border-neutral-200 rounded-[6px] flex items-center gap-2 mb-2.5">
            <IoIosSearch size={20} className="text-neutral-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-none bg-transparent outline-none w-full placeholder:text-neutral-200 text-neutral-50"
              placeholder="Search currencies..."
            />
          </div>

          {popularCurrenciesList.length > 0 && (
            <>
              <p className="w-full flex items-center justify-between p-2 border-b border-b-neutral-500 font-normal text-[12px] text-neutral-200">
                <span>POPULAR</span>
                <span>{popularCurrenciesList.length}</span>
              </p>
              <StaggerContainer staggerDelay={0.02} className="flex flex-col gap-1">
                {popularCurrenciesList.map(renderCurrencyItem)}
              </StaggerContainer>
            </>
          )}

          {otherCurrenciesList.length > 0 && (
            <>
              <p className="w-full flex items-center justify-between p-2 border-b border-b-neutral-500 font-normal text-[12px] text-neutral-200">
                <span>OTHER CURRENCIES</span>
                <span>{otherCurrenciesList.length}</span>
              </p>
              <StaggerContainer staggerDelay={0.02} className="flex flex-col gap-1">
                {otherCurrenciesList.map(renderCurrencyItem)}
              </StaggerContainer>
            </>
          )}
        </div>
      </>
    );
  };

  // ── Skeleton State ──────────────────────────────────────────────────────

  if (currenciesLoading || ratesLoading) {
    return (
      <SlideUp delay={0.4} duration={0.6}>
        <div className="space-y-4 px-4 mt-8 max-w-[1036px] mx-auto pt-24">
          <h2 className="text-[20px] font-normal text-neutral-50">
            CHECK THE RATE
          </h2>
          <div className="bg-neutral-700 rounded-[20px] p-4 space-y-4 flex flex-col items-center justify-center w-full">
            <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full relative">
              <h4 className="text-neutral-100 font-normal text-sm">SEND</h4>
              <div className="flex items-center justify-between">
                <ShimmerBlock width="120px" height="36px" rounded="6px" />
                <ShimmerBlock width="90px" height="40px" rounded="8px" />
              </div>
            </div>
            <div className="w-[48px] h-[48px] border-sm bg-neutral-600 border border-neutral-500 flex items-center justify-center">
              <Spinner size={20} color="text-neutral-400" />
            </div>
            <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full relative">
              <h4 className="text-neutral-100 font-normal text-sm">RECEIVE</h4>
              <div className="flex items-center justify-between">
                <ShimmerBlock width="140px" height="36px" rounded="6px" />
                <ShimmerBlock width="90px" height="40px" rounded="8px" />
              </div>
            </div>
          </div>
        </div>
      </SlideUp>
    );
  }

  // ── Error State ─────────────────────────────────────────────────────────

  if (currenciesError || ratesError) {
    return (
      <SlideUp delay={0.4} duration={0.6}>
        <div className="space-y-4 px-4 mt-8">
          <h2 className="text-[20px] font-normal text-neutral-50">
            CHECK THE RATE
          </h2>
          <AnimatePresence>
            <ErrorBanner
              message={
                currenciesError
                  ? "Failed to load currencies"
                  : "Failed to load exchange rates"
              }
              onRetry={() => {
                if (currenciesError) refetchCurrencies();
                if (ratesError) refetchRates();
              }}
            />
          </AnimatePresence>
        </div>
      </SlideUp>
    );
  }

  // ── Loaded State ───────────────────────────────────────────────────────

  return (
    <SlideUp delay={0.4} duration={0.6}>
      <div className="space-y-4 px-4 mt-8 max-w-[1036px] mx-auto pt-24">
        <h2 className="text-[20px] font-normal text-neutral-50">
          CHECK THE RATE
        </h2>
        <div className="bg-neutral-700 rounded-[20px]">
          <div className=" p-4 space-y-4 flex flex-col items-center justify-center w-full md:flex-row md:gap-6  md:justify-between md:items-center">
            <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full md:max-w-[292px] lg:max-w-[450px] relative">
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
                  className="font-bold text-[32px] lg:text-[40px] text-neutral-50 bg-transparent outline-none w-1/2 min-w-0 placeholder-neutral-400"
                  placeholder="0.00"
                />
                <div className="">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === "from" ? null : "from")
                    }
                    className="p-[10px] border-sm bg-neutral-500 border border-neutral-400 flex items-center gap-2 hover:bg-neutral-400 transition-colors cursor-pointer"
                  >
                    <div className="text-xl leading-none">
                      {getFlagEmoji(fromCurrency)}
                    </div>
                    <span className="font-normal text-sm text-neutral-50">
                      {fromCurrency}
                    </span>
                    <IoMdArrowDropdown className="text-neutral-50" />
                  </button>
                  {renderCurrencyDropdown("from")}
                </div>
              </div>
            </div>

            <SwapButton onClick={handleSwap} isLoading={ratesFetching} />

            <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full relative md:max-w-[292px] lg:max-w-[450px]">
              <h4 className="text-neutral-100 font-normal text-sm">RECEIVE</h4>
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  <motion.span
                    layout
                    onClick={() => setShowFullAmount((v) => !v)}
                    className={`font-bold text-[32px] lg:text-[40px] text-lime-500 cursor-pointer select-none ${
                      showFullAmount ? 'break-all' : 'truncate'
                    }`}
                    title={showFullAmount ? 'Click to collapse' : 'Click to expand'}
                  >
                    {getConvertedAmount()}
                  </motion.span>
                  <span className={`text-[10px] text-neutral-400 transition-opacity ${
                    showFullAmount ? 'opacity-100' : 'opacity-50'
                  }`}>
                    {showFullAmount ? 'click to collapse' : 'click to expand'}
                  </span>
                </div>
                <div className="shrink-0">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === "to" ? null : "to")
                    }
                    className="p-[10px] border-sm bg-neutral-500 border border-neutral-400 flex items-center gap-2 hover:bg-neutral-400 transition-colors cursor-pointer"
                  >
                    <div className="text-xl leading-none">
                      {getFlagEmoji(toCurrency)}
                    </div>
                    <span className="font-normal text-sm text-neutral-50">
                      {toCurrency}
                    </span>
                    <IoMdArrowDropdown className="text-neutral-50" />
                  </button>
                  {renderCurrencyDropdown("to")}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full border border-neutral-500 border-dashed h-px"></div>
          <div className="p-4 text-center flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <p className="text-neutral-50 text-preset md:text-[12px]">1 USD = 0.8530 EUR</p>
            <div className="flex items-center gap-2 *:cursor-pointer">
              <button className="font-medium text-[12px] px-3 py-2 border-sm bg-lime-500 flex items-center text-neutral-900 gap-2">
                <FaStar /> FAVORITED
              </button>
              <button className="font-medium text-[12px] px-3 py-2 border-sm border border-lime-500">
                LOG CONVERSION
              </button>
            </div>
          </div>
        </div>
      </div>
    </SlideUp>
  );
};

export default Converter;
