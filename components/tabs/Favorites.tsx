"use client"

import { MdOutlineArrowRightAlt } from "react-icons/md";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { useFavorites, useRemoveFavorite } from '@/hooks/useFavorites';
import { useRates } from '@/hooks/useRates';
import { SlideInRow, StaggerContainer, ShimmerBlock, ErrorBanner, SpringPop } from '@/components/Motion';

interface FavoritesProps {
  amount: string;
  onLoadPair?: (from: string, to: string) => void;
}

const Favorites = ({ amount, onLoadPair }: FavoritesProps) => {
  const { data: favorites, isLoading: favsLoading } = useFavorites();
  const { mutate: removeFavorite } = useRemoveFavorite();

  const bases = Array.from(new Set(favorites?.map(f => f.from_currency) || []));
  const { data: rates, isLoading: ratesLoading, isError, refetch } = useRates(bases);

  const numAmount = Number(amount) || 0;
  const isLoading = favsLoading || (ratesLoading && favorites && favorites.length > 0);

  if (isLoading) {
    return (
      <div className="w-full px-4 max-w-[1028px] mx-auto pb-8 md:pb-[48px]">
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
      <div className="w-full px-4 max-w-[1028px] mx-auto pb-8 md:pb-[48px]">
        <ErrorBanner message="Failed to load favorite rates" onRetry={refetch} />
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div className="w-full px-4 max-w-[1028px] mx-auto pb-8 md:pb-[48px]">
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
    <div className='w-full max-w-[1036px] mx-auto pb-8 md:pb-[48px] px-4'>
      <div className='p-4 bg-neutral-700 border border-neutral-600 rounded-[16px]'>
        <h4 className='flex items-center justify-between'>
          <span className='font-medium text-base text-neutral-50'>PINNED PAIRS</span>
          <span className='font-normal text-[12px] opacity-70 text-neutral-50'>{favorites.length} FAVORITES</span>
        </h4>
        <StaggerContainer staggerDelay={0.1} className="flex flex-col gap-3 mt-4">
          {favorites.map((fav) => {
            const { from_currency: base, to_currency: quote } = fav;
            const rateItem = rates?.find(r => r.base === base && r.quote === quote);
            const rate = rateItem ? rateItem.rate : 0;
            const convertedValue = numAmount * rate;
            
            const change = rateItem?.change || 0;
            const direction = rateItem?.direction || "flat";

            return (
              <SlideInRow key={`${base}-${quote}`}>
                <div 
                  className="p-3 bg-neutral-600 border border-neutral-500 rounded-[10px] flex items-center justify-between cursor-pointer hover:bg-neutral-500/50 transition-colors"
                  onClick={() => onLoadPair?.(base, quote)}
                >
                  <p className="flex items-center gap-1 font-normal text-sm text-neutral-50">
                    <span>{base}</span>
                    <MdOutlineArrowRightAlt className="text-neutral-200"/>
                    <span>{quote}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="font-normal text-base text-neutral-50 text-right">
                        {rate > 0 ? convertedValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
                      </span>
                      {direction === "up" && (
                        <span className="flex items-center justify-end text-preset text-green-500">
                          <IoMdArrowDropup /> +{change}%
                        </span>
                      )}
                      {direction === "down" && (
                        <span className="flex items-center justify-end text-preset text-red-500">
                          <IoMdArrowDropdown /> {change}%
                        </span>
                      )}
                      {direction === "flat" && (
                        <span className="flex items-center justify-end text-preset text-neutral-400">
                           0.00%
                        </span>
                      )}
                    </div>
                    <button 
                      className={`w-8 h-8 radius-sm border bg-neutral-600 p-2 flex items-center justify-center cursor-pointer hover:opacity-70 dark:border-lime-500 border-lime-600`} 
                      onClick={(e) => { e.stopPropagation(); removeFavorite({ from: base, to: quote }); }}
                      title="Remove from favorites"
                    >
                      <SpringPop isActive={true}>
                        <FaStar className="dark:text-lime-500 text-lime-700"/>
                      </SpringPop>
                    </button>
                  </div>
                </div>
              </SlideInRow>
            );
          })}
        </StaggerContainer>
      </div>
    </div>
  )
}

export default Favorites