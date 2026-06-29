"use client";

import { useState } from "react";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { useRates } from "@/hooks/useRates";
import { useFavorites, useAddFavorite, useRemoveFavorite } from "@/hooks/useFavorites";
import { SlideInRow, SpringPop, StaggerContainer, ShimmerBlock, ErrorBanner } from "@/components/Motion";
import { POPULAR_CURRENCIES, CURRENCY_NAMES } from "@/constants/currencies";

interface DashboardProps {
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

type SortField = 'name' | 'rate' | 'change1d' | 'change30d';

const Dashboard = ({ base, amount }: DashboardProps) => {
  const { data: rates, isLoading, isError, refetch } = useRates(base);
  const { data: favorites } = useFavorites();
  const { mutate: addFavorite } = useAddFavorite();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const [sortField, setSortField] = useState<SortField>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9;

  const handleToggleFavorite = (quote: string) => {
    const isFav = favorites?.some(f => f.from_currency === base && f.to_currency === quote);
    if (isFav) {
      removeFavorite({ from: base, to: quote });
    } else {
      addFavorite({ from: base, to: quote });
    }
  };

  const numAmount = Number(amount) || 0;

  if (isLoading) {
    return (
      <div className="w-full px-4 max-w-[1036px] mx-auto pb-8 md:pb-[48px]">
        <div className="bg-neutral-700 border border-neutral-600 p-4 rounded-[16px]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => <ShimmerBlock key={i} height="120px" rounded="10px" />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-4 max-w-[1036px] mx-auto pb-8 md:pb-[48px]">
        <ErrorBanner message="Failed to load dashboard rates" onRetry={refetch} />
      </div>
    );
  }

  if (!rates) return null;

  // Filter out the base currency
  let dashboardRates = rates.filter(r => r.quote !== base);

  // Apply "popular" filter if not showing all
  if (!showAll) {
    dashboardRates = dashboardRates.filter(r => POPULAR_CURRENCIES.includes(r.quote));
  }

  // Sort
  dashboardRates.sort((a, b) => {
    let valA, valB;
    if (sortField === 'name') {
      valA = a.quote;
      valB = b.quote;
      return sortAsc ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA as string);
    } else if (sortField === 'rate') {
      valA = a.rate;
      valB = b.rate;
    } else if (sortField === 'change1d') {
      valA = a.change;
      valB = b.change;
    } else {
      valA = a.change30d || 0;
      valB = b.change30d || 0;
    }
    return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const totalPages = Math.ceil(dashboardRates.length / ITEMS_PER_PAGE);
  const currentRates = dashboardRates.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <div className="w-full px-4 max-w-[1036px] mx-auto pb-8 md:pb-[48px]">
      <div className="bg-neutral-700 border border-neutral-600 p-4 rounded-[16px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-sm font-normal text-neutral-200">DASHBOARD</h3>
            <p className="font-medium text-lg text-neutral-50 flex items-center gap-1 mt-1">
              <span>{numAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              <span className="text-neutral-400">FROM</span>
              <span>{base}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={() => { setShowAll(!showAll); setCurrentPage(1); }}
              className="px-3 py-1.5 text-[12px] rounded-md border border-neutral-500 text-neutral-200 hover:bg-neutral-600 transition-colors"
            >
              {showAll ? "SHOW POPULAR" : "SHOW ALL"}
            </button>
            <div className="flex items-center gap-2 bg-neutral-600 p-1 rounded-md border border-neutral-500">
              <span className="text-[12px] text-neutral-400 px-2">SORT:</span>
              <select 
                value={sortField} 
                onChange={(e) => { setSortField(e.target.value as SortField); setCurrentPage(1); }}
                className="bg-transparent text-[12px] text-neutral-50 outline-none cursor-pointer"
              >
                <option className="bg-neutral-700" value="name">Name</option>
                <option className="bg-neutral-700" value="rate">Rate</option>
                <option className="bg-neutral-700" value="change1d">1D Change</option>
                <option className="bg-neutral-700" value="change30d">30D Change</option>
              </select>
              <button 
                onClick={() => { setSortAsc(!sortAsc); setCurrentPage(1); }} 
                className="px-2 text-neutral-400 hover:text-neutral-50"
              >
                {sortAsc ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        <StaggerContainer staggerDelay={0.05} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentRates.map((rateItem) => {
            const { quote, rate, change, direction, change30d, direction30d } = rateItem;
            const convertedValue = numAmount * rate;
            const isFav = favorites?.some(f => f.from_currency === base && f.to_currency === quote) ?? false;
            const currencyName = CURRENCY_NAMES[quote] || quote;

            return (
              <SlideInRow key={quote}>
                <div className="p-4 rounded-[12px] bg-neutral-600 border dark:border-neutral-500 border-neutral-300 hover:bg-neutral-500/50 transition-colors flex flex-col h-full relative group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center text-2xl shadow-sm bg-neutral-700 rounded-full border border-neutral-500">
                        {getFlagEmoji(quote)}
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="font-medium text-base text-neutral-50">{quote}</span>
                        <span className="text-[12px] text-neutral-300 font-space-grotesk truncate max-w-[120px]">{currencyName}</span>
                      </div>
                    </div>
                    <button
                      className={`p-2 h-8 w-8 rounded-full border flex items-center justify-center transition-colors hover:bg-neutral-600 ${
                        isFav
                          ? "dark:border-lime-500 dark:text-lime-500 border-lime-600 text-lime-700"
                          : "border-neutral-500 text-neutral-400 hover:text-neutral-200"
                      }`}
                      onClick={() => handleToggleFavorite(quote)}
                    >
                      <SpringPop isActive={isFav}>
                        {isFav ? <FaStar size={12} /> : <FaRegStar size={12} />}
                      </SpringPop>
                    </button>
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex flex-col">
                      <span className="font-bold text-2xl text-neutral-50">
                        {rate > 0 ? convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "---"}
                      </span>
                      <span className="text-[12px] text-neutral-400 mt-0.5">
                        1 {base} = {rate > 0 ? rate.toFixed(4) : "---"} {quote}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-500/50">
                      <span className={`flex items-center text-[10px] px-2 py-1 rounded-sm font-medium ${
                        direction === 'up' ? 'bg-green-500/10 text-green-500' : 
                        direction === 'down' ? 'bg-red-500/10 text-red-500' : 
                        'bg-neutral-500/10 text-neutral-400'
                      }`}>
                        1D: {direction === 'up' ? '+' : ''}{change}%
                      </span>
                      <span className={`flex items-center text-[10px] px-2 py-1 rounded-sm font-medium ${
                        direction30d === 'up' ? 'bg-green-500/10 text-green-500' : 
                        direction30d === 'down' ? 'bg-red-500/10 text-red-500' : 
                        'bg-neutral-500/10 text-neutral-400'
                      }`}>
                        30D: {direction30d === 'up' ? '+' : ''}{change30d}%
                      </span>
                    </div>
                  </div>
                </div>
              </SlideInRow>
            );
          })}
        </StaggerContainer>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6 pt-4 border-t border-neutral-600">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-md border border-neutral-500 text-neutral-200 text-[12px] hover:bg-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              PREV
            </button>
            <span className="text-[12px] text-neutral-400 mx-2">
              PAGE {currentPage} OF {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-md border border-neutral-500 text-neutral-200 text-[12px] hover:bg-neutral-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              NEXT
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
