import React from 'react';
import { useFavorites, useRemoveFavorite } from '@/hooks/useFavorites';
import { useRates } from '@/hooks/useRates';
import { FaTrashCan } from 'react-icons/fa6';
import { SlideInRow, StaggerContainer, ShimmerBlock, ErrorBanner } from '@/components/Motion';
import { CURRENCY_NAMES } from '@/constants/currencies';

interface FavoritesProps {
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

const Favorites = ({ amount }: FavoritesProps) => {
  const { data: favorites, isLoading: favsLoading } = useFavorites();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const bases = Array.from(new Set(favorites?.map(f => f.from_currency) || []));
  const { data: rates, isLoading: ratesLoading, isError, refetch } = useRates(bases);

  const numAmount = Number(amount) || 0;
  const isLoading = favsLoading || (ratesLoading && favorites && favorites.length > 0);

  if (isLoading) {
    return (
      <div className="w-full px-4 max-w-[1036px] mx-auto">
        <div className="bg-neutral-700 border border-neutral-600 p-4 rounded-[16px] flex flex-col gap-3">
          <ShimmerBlock height="60px" rounded="10px" />
          <ShimmerBlock height="60px" rounded="10px" />
          <ShimmerBlock height="60px" rounded="10px" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full px-4 max-w-[1036px] mx-auto">
        <ErrorBanner message="Failed to load favorite rates" onRetry={refetch} />
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="w-full px-4 max-w-[1036px] mx-auto">
        <div className="bg-neutral-700 border border-neutral-600 p-12 rounded-[16px] flex flex-col items-center justify-center text-center text-neutral-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <p className="font-medium text-neutral-200">No favorites yet</p>
          <p className="text-sm mt-1">Tap the star icon on any currency pair to save it here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 max-w-[1036px] mx-auto">
      <div className="bg-neutral-700 border border-neutral-600 p-4 rounded-[16px]">
        <div className="w-full flex items-center justify-between mb-4">
          <span className="text-sm font-normal text-neutral-200">
            SAVED PAIRS
          </span>
          <span className="font-regular text-[12px] text-neutral-50">{favorites.length} PAIRS</span>
        </div>

        <StaggerContainer staggerDelay={0.1} className="flex flex-col gap-3">
          {favorites.map((fav) => {
            const { from_currency: base, to_currency: quote } = fav;
            const rateItem = rates?.find(r => r.base === base && r.quote === quote);
            const rate = rateItem ? rateItem.rate : 0;
            const convertedValue = numAmount * rate;
            const currencyName = CURRENCY_NAMES[quote] || quote;

            return (
              <SlideInRow key={`${base}-${quote}`}>
                <div className="p-3 rounded-[10px] bg-neutral-600 border border-neutral-500 flex items-center justify-between hover:bg-neutral-500/50 transition-colors group relative overflow-hidden">
                  <div className="flex items-center gap-[6.5px]">
                    <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-lg shadow-sm border border-neutral-500">
                      {getFlagEmoji(quote)}
                    </div>
                    <p className="flex flex-col leading-tight">
                      <span className="font-medium text-neutral-50">{base} / {quote}</span>
                      <span className="text-[12px] text-neutral-200">{currencyName}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-[10px] transition-transform duration-300 md:group-hover:-translate-x-12">
                    <p className="flex flex-col text-right leading-tight">
                      <span className="font-medium text-neutral-50">
                        {rate > 0 ? convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
                      </span>
                      <span className="text-[12px] text-neutral-400">
                        @ {rate > 0 ? rate.toFixed(4) : '---'}
                      </span>
                    </p>
                  </div>
                  {/* Delete button (slides in on hover on desktop, always visible on mobile if we wanted, but let's make it a button that appears on the right edge) */}
                  <button
                    className="absolute right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity p-2 h-10 w-10 radius-sm bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center"
                    onClick={() => removeFavorite({ from: base, to: quote })}
                    title="Remove from favorites"
                  >
                    <FaTrashCan />
                  </button>
                </div>
              </SlideInRow>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  );
};

export default Favorites;
