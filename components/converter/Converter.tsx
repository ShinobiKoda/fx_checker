"use client";

import React, { useState, useEffect } from "react";
import { IoMdArrowDropdown, IoIosSearch, IoMdShare, IoMdCode } from "react-icons/io";
import { FaStar, FaRegStar } from "react-icons/fa6";
import { toast } from "sonner";
import { useCurrencies } from "@/hooks/useCurrencies";
import { useRates } from "@/hooks/useRates";
import { useAuth } from "@/hooks/useAuth";
import { useIsFavorite, useAddFavorite, useRemoveFavorite } from "@/hooks/useFavorites";
import { useAddConversionLog } from "@/hooks/useConversionLog";
import { useRecentCurrencies } from "@/hooks/useRecentCurrencies";
import { getCurrencyNote } from "@/lib/currencyNotes";
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
  SpringPop,
} from "@/components/Motion";
import { SplitView } from "./SplitView";
import { ConversionInsight } from "./ConversionInsight";
import EmbedModal from "@/components/ui/EmbedModal";

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
  amount: string;
  setAmount: (c: string) => void;
  onOpenAuth: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  isReversed?: boolean;
  setIsReversed?: (v: boolean) => void;
}

const Converter = ({
  fromCurrency,
  toCurrency,
  setFromCurrency,
  setToCurrency,
  amount,
  setAmount,
  onOpenAuth,
  inputRef,
  isReversed = false,
  setIsReversed,
}: ConverterProps) => {
  const [displayAmount, setDisplayAmount] = useState<string>("1,000");
  const [dropdownOpen, setDropdownOpen] = useState<"from" | "to" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullAmount, setShowFullAmount] = useState(false);
  const [isLoggedFeedback, setIsLoggedFeedback] = useState(false);
  const [viewMode, setViewMode] = useState<"standard" | "split">("standard");

  // Fee Simulator state
  const [feeType, setFeeType] = useState<"percent" | "flat">("percent");
  const [feeValue, setFeeValue] = useState<string>("0");
  const [isFeeExpanded, setIsFeeExpanded] = useState(false);
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);
  const [homeCurrency, setHomeCurrency] = useState<string | null>(null);

  const { recents, addRecent } = useRecentCurrencies();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHomeCurrency(localStorage.getItem("fx_home_currency"));
    }
  }, []);

  useEffect(() => {
    if (amount === "") {
      setDisplayAmount("");
    }
  }, [amount]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedType = localStorage.getItem("fx_fee_type");
      const savedValue = localStorage.getItem("fx_fee_value");
      if (savedType === "percent" || savedType === "flat") setFeeType(savedType);
      if (savedValue) setFeeValue(savedValue);
    }
  }, []);

  const updateFeeType = (type: "percent" | "flat") => {
    setFeeType(type);
    if (typeof window !== "undefined") localStorage.setItem("fx_fee_type", type);
  };

  const updateFeeValue = (val: string) => {
    setFeeValue(val);
    if (typeof window !== "undefined") localStorage.setItem("fx_fee_value", val);
  };

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

  const { isAuthenticated } = useAuth();
  const isFavorite = useIsFavorite(fromCurrency, toCurrency);
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const handleToggleFavorite = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }

    if (isFavorite) {
      removeFavorite({ from: fromCurrency, to: toCurrency });
    } else {
      addFavorite({ from: fromCurrency, to: toCurrency });
    }
  };

  const handleSetHomeCurrency = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("fx_home_currency", fromCurrency);
      setHomeCurrency(fromCurrency);
      toast.success(`${fromCurrency} set as default Home Currency!`);
    }
  };

  const { mutate: addConversionLog } = useAddConversionLog();

  const handleLogConversion = () => {
    if (!isAuthenticated) {
      onOpenAuth();
      return;
    }
    
    if (amount && !isNaN(Number(amount))) {
      const rateItem = rates?.find((r) => r.base === fromCurrency && r.quote === toCurrency);
      const rate = rateItem?.rate || 1;
      const convertedValue = fromCurrency === toCurrency ? Number(amount) : Number(amount) * rate;

      addConversionLog({
        from: fromCurrency,
        to: toCurrency,
        amount: Number(amount),
        convertedAmount: convertedValue
      }, {
        onSuccess: () => {
          setIsLoggedFeedback(true);
          setTimeout(() => setIsLoggedFeedback(false), 2000);
        }
      });
    }
  };

  const handleShareLink = () => {
    const url = new URL(window.location.origin);
    url.searchParams.set("from", fromCurrency);
    url.searchParams.set("to", toCurrency);
    url.searchParams.set("amount", amount || "0");
    
    navigator.clipboard.writeText(url.toString());
    toast.success("Conversion link copied to clipboard!");
  };

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getRawCalculatedNumber = () => {
    if (!amount || isNaN(Number(amount))) return 0;
    if (fromCurrency === toCurrency) return Number(amount);

    const rateItem = rates?.find(
      (r) => r.base === fromCurrency && r.quote === toCurrency,
    );
    if (!rateItem) return 0;

    if (isReversed) {
      return Number(amount) / rateItem.rate;
    } else {
      return Number(amount) * rateItem.rate;
    }
  };

  const getCalculatedString = () => {
    const val = getRawCalculatedNumber();
    if (val === 0) return "0.0000";
    return val.toLocaleString(undefined, {
      minimumFractionDigits: fromCurrency === toCurrency ? 2 : 4,
      maximumFractionDigits: fromCurrency === toCurrency ? 2 : 4,
    });
  };

  const getFeeDetails = () => {
    const rawVal = getRawCalculatedNumber();
    if (rawVal === 0 || !feeValue || isNaN(Number(feeValue))) return null;
    
    const feeNum = Number(feeValue);
    let feeAmount = 0;
    
    if (feeType === "percent") {
      feeAmount = rawVal * (feeNum / 100);
    } else {
      feeAmount = feeNum;
    }
    
    let finalAmount = 0;
    if (isReversed) {
      // Reversed: You need to send MORE to cover the fee
      finalAmount = rawVal + feeAmount;
    } else {
      // Normal: You receive LESS because of the fee
      finalAmount = rawVal - feeAmount;
    }
    
    return {
      feeAmount: feeAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
      finalAmount: finalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }),
      currency: isReversed ? fromCurrency : toCurrency
    };
  };

  const getRateString = () => {
    if (fromCurrency === toCurrency) return `1 ${fromCurrency} = 1.0000 ${toCurrency}`;
    const rateItem = rates?.find(r => r.base === fromCurrency && r.quote === toCurrency);
    if (!rateItem) return `1 ${fromCurrency} = --- ${toCurrency}`;
    return `1 ${fromCurrency} = ${rateItem.rate.toFixed(4)} ${toCurrency}`;
  };

  const renderCurrencyDropdown = (type: "from" | "to") => {
    if (dropdownOpen !== type || !currencies) return null;

    const filteredCurrencies = Object.entries(currencies).filter(
      ([code, name]) =>
        code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const recentCurrenciesList = filteredCurrencies
      .filter(([code]) => recents.includes(code))
      .sort((a, b) => recents.indexOf(a[0]) - recents.indexOf(b[0]));

    const popularCurrenciesList = filteredCurrencies.filter(([code]) =>
      POPULAR_CURRENCIES.includes(code) && !recents.includes(code)
    );
    const otherCurrenciesList = filteredCurrencies.filter(
      ([code]) => !POPULAR_CURRENCIES.includes(code) && !recents.includes(code)
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
                addRecent(code);
                setDropdownOpen(null);
                setSearchQuery("");
              }}
              className={`flex items-center gap-3 text-left w-[90%] overflow-hidden`}
            >
              <span className="text-xl leading-none shrink-0">{getFlagEmoji(code)}</span>
              <span className="font-normal text-neutral-50 text-sm shrink-0">{code}</span>
              <span className="text-[12px] text-neutral-400 truncate w-full" title={getCurrencyNote(code, name)}>{getCurrencyNote(code, name)}</span>
            </button>
            {isSelected && <FaCheck className="dark:text-lime-500 text-lime-700 shrink-0" />}
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
          className="absolute top-full right-0 mt-2 w-full max-w-[311px] max-h-[458px] overflow-y-auto bg-neutral-600 border border-neutral-400 radius-sm z-50 shadow-2xl flex flex-col p-2 gap-1 custom-scrollbar"
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

          {recentCurrenciesList.length > 0 && (
            <>
              <p className="w-full flex items-center justify-between p-2 border-b border-b-neutral-500 font-normal text-[12px] text-neutral-400">
                <span>RECENTLY USED</span>
              </p>
              <StaggerContainer staggerDelay={0.02} className="flex flex-col gap-1 mb-2">
                {recentCurrenciesList.map(renderCurrencyItem)}
              </StaggerContainer>
            </>
          )}

          {popularCurrenciesList.length > 0 && (
            <>
              <p className="w-full flex items-center justify-between p-2 border-b border-b-neutral-500 font-normal text-[12px] text-neutral-400">
                <span>POPULAR</span>
              </p>
              <StaggerContainer staggerDelay={0.02} className="flex flex-col gap-1 mb-2">
                {popularCurrenciesList.map(renderCurrencyItem)}
              </StaggerContainer>
            </>
          )}

          {otherCurrenciesList.length > 0 && (
            <>
              <p className="w-full flex items-center justify-between p-2 border-b border-b-neutral-500 font-normal text-[12px] text-neutral-400">
                <span>OTHER CURRENCIES</span>
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
            <div className="w-[48px] h-[48px] radius-sm bg-neutral-600 border border-neutral-500 flex items-center justify-center">
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

  const renderAmountBlock = (isInput: boolean) => {
    if (isInput) {
      return (
        <input
          ref={inputRef}
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
      );
    }
    return (
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <motion.span
          layout
          onClick={() => setShowFullAmount((v) => !v)}
          className={`font-bold text-[32px] lg:text-[40px] dark:text-lime-500 text-lime-700 cursor-pointer select-none ${
            showFullAmount ? 'break-all' : 'truncate'
          }`}
          title={showFullAmount ? 'Click to collapse' : 'Click to expand'}
        >
          {getCalculatedString()}
        </motion.span>
        <span className={`text-[10px] text-neutral-400 transition-opacity ${
          showFullAmount ? 'opacity-100' : 'opacity-50'
        }`}>
          {showFullAmount ? 'click to collapse' : 'click to expand'}
        </span>
      </div>
    );
  };

  // ── Loaded State ───────────────────────────────────────────────────────

  const feeDetails = getFeeDetails();

  return (
    <SlideUp delay={0.4} duration={0.6}>
      <div className="space-y-4 px-4 mt-8 max-w-[1036px] mx-auto pt-24">
        <h2 className="text-[20px] font-normal text-neutral-50 text-center hidden">
          CHECK THE RATE
        </h2>
        <div className="flex bg-neutral-700 rounded-full p-1 max-w-[200px] mx-auto mb-6 border border-neutral-600">
          <button 
            onClick={() => setViewMode("standard")}
            className={`flex-1 py-1.5 px-4 text-xs font-medium rounded-full transition-all cursor-pointer ${viewMode === "standard" ? "bg-lime-500 text-black shadow-sm" : "text-neutral-300 hover:text-neutral-100"}`}
          >
            Standard
          </button>
          <button 
            onClick={() => setViewMode("split")}
            className={`flex-1 py-1.5 px-4 text-xs font-medium rounded-full transition-all cursor-pointer ${viewMode === "split" ? "bg-lime-500 text-black shadow-sm" : "text-neutral-300 hover:text-neutral-100"}`}
          >
            Split Mode
          </button>
        </div>
        
        <div className="bg-neutral-700 rounded-[20px]">
          <div className={`p-4 space-y-4 flex flex-col items-center justify-center w-full ${viewMode === 'standard' ? 'md:flex-row md:gap-6 md:justify-between md:items-center' : ''}`}>
            <div className={`rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full relative ${viewMode === 'standard' ? 'md:max-w-[292px] lg:max-w-[450px]' : ''}`}>
              <div className="flex items-center justify-between">
                <h4 className="text-neutral-100 font-normal text-sm">SEND</h4>
                {homeCurrency !== fromCurrency && (
                  <button 
                    onClick={handleSetHomeCurrency}
                    className="text-[10px] text-lime-500 hover:text-lime-400 font-medium transition-colors cursor-pointer bg-lime-500/10 px-2 py-1 rounded border border-lime-500/20"
                  >
                    Set as Default
                  </button>
                )}
              </div>
              <div className="flex items-start justify-between gap-2">
                {renderAmountBlock(!isReversed)}
                <div className="">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === "from" ? null : "from")
                    }
                    className="p-[10px] radius-sm bg-neutral-500 border border-neutral-400 flex items-center gap-2 hover:bg-neutral-400 transition-colors cursor-pointer"
                  >
                    <div className="text-xl leading-none">
                      {getFlagEmoji(fromCurrency)}
                    </div>
                    <span className="font-normal text-sm text-neutral-50">
                      {fromCurrency}
                    </span>
                    <motion.span
                      animate={{ rotate: dropdownOpen === 'from' ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      style={{ display: 'flex' }}
                    >
                      <IoMdArrowDropdown className="text-neutral-50" />
                    </motion.span>
                  </button>
                  {renderCurrencyDropdown("from")}
                </div>
              </div>
              
              {!isReversed && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {[100, 500, 1000, 5000, 10000].map(val => (
                    <button 
                      key={val}
                      onClick={() => {
                        const strVal = val.toString();
                        setDisplayAmount(formatWithCommas(strVal));
                        setAmount(strVal);
                      }}
                      className="px-2 py-1 text-[10px] font-medium bg-neutral-700 text-neutral-300 hover:text-neutral-50 rounded-md border border-neutral-500 hover:border-lime-500 hover:bg-neutral-600 transition-colors"
                    >
                      {val.toLocaleString()}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {viewMode === "standard" ? (
              <>
                <SwapButton onClick={handleSwap} isLoading={ratesFetching} />

                <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full relative md:max-w-[292px] lg:max-w-[450px]">
                  <h4 className="text-neutral-100 font-normal text-sm">RECEIVE</h4>
                  <div className="flex items-start justify-between gap-2">
                    {renderAmountBlock(isReversed)}
                    <div className="shrink-0">
                      <button
                        onClick={() =>
                          setDropdownOpen(dropdownOpen === "to" ? null : "to")
                        }
                        className="p-[10px] radius-sm bg-neutral-500 border border-neutral-400 flex items-center gap-2 hover:bg-neutral-400 transition-colors cursor-pointer"
                      >
                        <div className="text-xl leading-none">
                          {getFlagEmoji(toCurrency)}
                        </div>
                        <span className="font-normal text-sm text-neutral-50">
                          {toCurrency}
                        </span>
                        <motion.span
                          animate={{ rotate: dropdownOpen === 'to' ? 180 : 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          style={{ display: 'flex' }}
                        >
                          <IoMdArrowDropdown className="text-neutral-50" />
                        </motion.span>
                      </button>
                      {renderCurrencyDropdown("to")}
                    </div>
                  </div>

                  {isReversed && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {[100, 500, 1000, 5000, 10000].map(val => (
                        <button 
                          key={val}
                          onClick={() => {
                            const strVal = val.toString();
                            setDisplayAmount(formatWithCommas(strVal));
                            setAmount(strVal);
                          }}
                          className="px-2 py-1 text-[10px] font-medium bg-neutral-700 text-neutral-300 hover:text-neutral-50 rounded-md border border-neutral-500 hover:border-lime-500 hover:bg-neutral-600 transition-colors"
                        >
                          {val.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full pt-4 border-t border-neutral-600 border-dashed">
                <SplitView amount={amount} fromCurrency={fromCurrency} rates={rates || []} />
              </div>
            )}
          </div>
          
          {viewMode === "standard" && (
            <>
              <div className="w-full border border-neutral-500 border-dashed h-px"></div>
              <div className="p-4 text-center flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
                <div className="flex items-center gap-3">
              <p className="text-neutral-50 text-preset md:text-[12px]">{getRateString()}</p>
              <button
                onClick={() => setIsReversed?.(!isReversed)}
                className={`text-[11px] font-medium px-2 py-1 radius-sm transition-colors border ${
                  isReversed 
                    ? "bg-lime-500 text-black border-lime-500" 
                    : "bg-neutral-600 text-neutral-300 border-neutral-500 hover:text-neutral-50"
                }`}
                title="Toggle Reverse Mode (R)"
              >
                ⇄ REVERSE
              </button>
            </div>
            <div className="grid grid-cols-2 md:flex items-center gap-2 w-full md:w-auto *:cursor-pointer">
              <button
                onClick={handleToggleFavorite}
                className={`font-medium text-[12px] px-3 py-2 radius-sm flex justify-center w-full md:w-auto items-center gap-2 transition-colors border hover:cursor-pointer ${
                  isFavorite 
                    ? "bg-lime-500 text-black border-lime-500" 
                    : "bg-neutral-600 text-neutral-200 border-neutral-300"
                }`}
              >
                <SpringPop isActive={isFavorite}>
                  {isFavorite ? <FaStar /> : <FaRegStar />}
                </SpringPop>
                {isFavorite ? "FAVORITED" : "FAVORITE"}
              </button>
              <button 
                onClick={handleShareLink}
                className="font-medium text-[12px] px-3 py-2 radius-sm flex justify-center w-full md:w-auto items-center gap-2 transition-colors border bg-neutral-600 text-neutral-200 border-neutral-300 hover:bg-neutral-500"
                title="Share this conversion"
              >
                <IoMdShare size={14} />
                SHARE
              </button>
              <button 
                onClick={handleLogConversion}
                className={`font-medium text-[12px] px-3 py-2 radius-sm flex justify-center w-full md:w-auto items-center gap-2 border transition-colors ${
                  isLoggedFeedback 
                    ? "bg-lime-500 text-black border-lime-500" 
                    : "dark:border-lime-500 dark:text-lime-500 border-lime-600 text-lime-700 hover:bg-lime-600/10 dark:hover:bg-lime-500/10"
                }`}
              >
                {isLoggedFeedback ? "LOGGED!" : "LOG"}
              </button>
              <button 
                onClick={() => setIsEmbedModalOpen(true)}
                className="font-medium text-[12px] px-3 py-2 radius-sm flex justify-center w-full md:w-auto items-center gap-2 transition-colors border bg-neutral-600 text-neutral-200 border-neutral-300 hover:bg-neutral-500"
                title="Embed this converter"
              >
                <IoMdCode size={16} />
                EMBED
              </button>
            </div>
          </div>
          <div className="w-full border border-neutral-500 border-dashed h-px"></div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsFeeExpanded(!isFeeExpanded)}>
              <div className="flex items-center gap-2">
                <span className="text-neutral-200 text-sm font-medium">Fee Simulator</span>
                {feeDetails && feeValue && feeValue !== "0" && (
                   <span className="text-[11px] bg-neutral-600 px-2 py-0.5 rounded text-neutral-300 border border-neutral-500">
                     Active
                   </span>
                )}
              </div>
              <motion.span
                animate={{ rotate: isFeeExpanded ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="flex items-center justify-center"
              >
                <IoMdArrowDropdown className="text-neutral-400" size={20} />
              </motion.span>
            </div>
            
            <AnimatePresence>
              {isFeeExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        value={feeValue}
                        onChange={(e) => updateFeeValue(e.target.value)}
                        className="w-20 bg-neutral-600 border border-neutral-500 radius-sm px-3 py-1.5 text-sm text-neutral-50 outline-none focus:border-lime-500 transition-colors"
                        placeholder="0"
                      />
                      <select
                        value={feeType}
                        onChange={(e) => updateFeeType(e.target.value as "percent" | "flat")}
                        className="bg-neutral-600 border border-neutral-500 radius-sm px-2 py-1.5 text-sm text-neutral-50 outline-none focus:border-lime-500 appearance-none cursor-pointer transition-colors"
                      >
                        <option value="percent">%</option>
                        <option value="flat">Flat</option>
                      </select>
                    </div>
                    
                    {feeDetails && feeValue && feeValue !== "0" && (
                      <div className="text-left md:text-right bg-neutral-800/50 p-3 rounded-lg border border-neutral-600 w-full md:w-auto">
                        <div className="text-sm text-neutral-50 font-medium">
                          After fee: <span className="text-lime-500">{feeDetails.finalAmount} {feeDetails.currency}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Fee amount: {feeDetails.feeAmount} {feeDetails.currency}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
            </>
          )}
        </div>
        {viewMode === "standard" && (
          <ConversionInsight 
            base={fromCurrency} 
            quote={toCurrency} 
            currentRate={rates?.find(r => r.base === fromCurrency && r.quote === toCurrency)?.rate || 1} 
          />
        )}
      </div>
      <EmbedModal 
        isOpen={isEmbedModalOpen} 
        onClose={() => setIsEmbedModalOpen(false)} 
        fromCurrency={fromCurrency} 
        toCurrency={toCurrency} 
        amount={amount || "1000"} 
      />
    </SlideUp>
  );
};

export default Converter;
