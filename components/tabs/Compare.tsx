"use client";

import { FaRegStar, FaStar } from "react-icons/fa6";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { useRates } from "@/hooks/useRates";
import {
  useFavorites,
  useAddFavorite,
  useRemoveFavorite,
} from "@/hooks/useFavorites";
import {
  SlideInRow,
  SpringPop,
  StaggerContainer,
  StaggerItem,
  ShimmerBlock,
  ErrorBanner,
} from "@/components/Motion";
import { POPULAR_CURRENCIES, CURRENCY_NAMES } from "@/constants/currencies";

interface CompareProps {
  base: string;
  amount: string;
}

const getFlagEmoji = (currencyCode: string) => {
  if (currencyCode === "EUR") return "🇪🇺";
  const countryCode = currencyCode.substring(0, 2);
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

const Compare = ({ base, amount }: CompareProps) => {
  const { data: rates, isLoading, isError, refetch } = useRates(base);
  const { data: favorites } = useFavorites();
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const handleToggleFavorite = (quote: string) => {
    const isFav = favorites?.some(
      (f) => f.from_currency === base && f.to_currency === quote,
    );
    if (isFav) {
      removeFavorite({ from: base, to: quote });
    } else {
      addFavorite({ from: base, to: quote });
    }
  };

  const numAmount = Number(amount) || 0;

  // Filter popular currencies excluding base
  const compareCurrencies = POPULAR_CURRENCIES.filter(
    (c: string) => c !== base,
  );

  return (
    <div className="w-full px-4 max-w-[1036px] mx-auto pb-8 md:pb-[48px]">
      <div className="bg-neutral-700 border border-neutral-600 p-4 rounded-[16px]">
        <div className="md:flex md:items-center md:justify-between">
          <div className="w-full flex items-center justify-between mb-1 md:justify-normal md:gap-3">
            <span className="text-sm font-normal text-neutral-200">
              MULTI-CURRENCY
            </span>
            <p className="font-medium text-base text-neutral-50 flex items-center gap-1">
              <span>
                {numAmount.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
              <span>FROM</span>
              <span>{base}</span>
            </p>
          </div>
          <h6 className="font-regular text-[12px] text-neutral-50 mb-4 opacity-70 text-nowrap">
            {compareCurrencies.length} PAIRS
          </h6>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {compareCurrencies.map((c: string) => (
              <ShimmerBlock key={c} height="60px" rounded="10px" />
            ))}
          </div>
        ) : isError ? (
          <ErrorBanner
            message="Failed to load comparison rates"
            onRetry={refetch}
          />
        ) : (
          <StaggerContainer staggerDelay={0.1} className="flex flex-col gap-3">
            {compareCurrencies.map((quote: string) => {
              const rateItem = rates?.find(
                (r) => r.base === base && r.quote === quote,
              );
              const rate = rateItem ? rateItem.rate : 0;
              const convertedValue = numAmount * rate;
              const isFav =
                favorites?.some(
                  (f) => f.from_currency === base && f.to_currency === quote,
                ) ?? false;
              const currencyName = CURRENCY_NAMES[quote] || quote;

              return (
                <SlideInRow key={quote}>
                  <div className="p-3 rounded-[10px] bg-neutral-600 border border-neutral-500 flex items-center justify-between hover:bg-neutral-500/50 transition-colors">
                    <div className="flex items-center gap-[6.5px]">
                      <div className="w-8 h-8 flex items-center justify-center text-lg shadow-sm">
                        {getFlagEmoji(quote)}
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="font-normal text-sm text-neutral-50">
                          {quote}
                        </span>
                        <span className="text-[12px] text-neutral-200 font-space-grotesk">
                          {currencyName}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <div className="flex flex-col text-right leading-tight">
                        <span className="font-normal text-neutral-50 text-base">
                          {rate > 0
                            ? convertedValue.toLocaleString(undefined, {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })
                            : "---"}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          @ {rate > 0 ? rate.toFixed(4) : "---"}
                        </span>
                        {rate > 0 && rateItem && (
                          <div className="hidden md:flex items-center justify-end gap-2 mt-1">
                            <span className={`flex items-center text-[10px] px-1.5 py-0.5 rounded-sm ${
                              rateItem.direction === 'up' ? 'bg-green-500/10 text-green-500' : 
                              rateItem.direction === 'down' ? 'bg-red-500/10 text-red-500' : 
                              'bg-neutral-500/10 text-neutral-400'
                            }`}>
                              1D: 
                              {rateItem.direction === 'up' && <IoMdArrowDropup className="text-[12px] ml-0.5" />}
                              {rateItem.direction === 'down' && <IoMdArrowDropdown className="text-[12px] ml-0.5" />}
                              {rateItem.direction === 'flat' && <span className="ml-0.5" />}
                              {rateItem.direction === 'up' ? '+' : ''}{rateItem.change}%
                            </span>
                            <span className={`flex items-center text-[10px] px-1.5 py-0.5 rounded-sm ${
                              rateItem.direction30d === 'up' ? 'bg-green-500/10 text-green-500' : 
                              rateItem.direction30d === 'down' ? 'bg-red-500/10 text-red-500' : 
                              'bg-neutral-500/10 text-neutral-400'
                            }`}>
                              30D: 
                              {rateItem.direction30d === 'up' && <IoMdArrowDropup className="text-[12px] ml-0.5" />}
                              {rateItem.direction30d === 'down' && <IoMdArrowDropdown className="text-[12px] ml-0.5" />}
                              {rateItem.direction30d === 'flat' && <span className="ml-0.5" />}
                              {rateItem.direction30d === 'up' ? '+' : ''}{rateItem.change30d}%
                            </span>
                          </div>
                        )}
                      </div>
                      <button
                        className={`p-2 h-10 w-10 radius-sm bg-neutral-700 border flex items-center justify-center transition-colors hover:bg-neutral-600 ${
                          isFav
                            ? "dark:border-lime-500 dark:text-lime-500 border-lime-600 text-lime-700"
                            : "border-neutral-500 text-neutral-400 hover:text-neutral-200"
                        }`}
                        onClick={() => handleToggleFavorite(quote)}
                      >
                        <SpringPop isActive={isFav}>
                          {isFav ? (
                            <FaStar />
                          ) : (
                            <FaRegStar className="text-neutral-400" />
                          )}
                        </SpringPop>
                      </button>
                    </div>
                  </div>
                </SlideInRow>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
};

export default Compare;
