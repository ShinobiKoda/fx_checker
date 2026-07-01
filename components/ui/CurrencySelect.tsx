"use client";

import React, { useState, useRef, useEffect, ReactNode } from "react";
import { IoIosSearch, IoMdArrowDropdown } from "react-icons/io";
import { FaCheck } from "react-icons/fa";
import { useCurrencies } from "@/hooks/useCurrencies";
import { useRecentCurrencies } from "@/hooks/useRecentCurrencies";
import { POPULAR_CURRENCIES } from "@/constants/currencies";
import { StaggerContainer, StaggerItem } from "@/components/Motion";
import { getFlagEmoji } from "@/lib/utils";
import { getCurrencyNote } from "@/lib/currencyNotes";

interface CurrencySelectProps {
  value?: string;
  onChange: (currency: string) => void;
  trigger?: ReactNode | ((isOpen: boolean) => ReactNode);
  className?: string;
  wrapperClassName?: string;
  align?: "left" | "right";
  disabled?: boolean;
}

export const CurrencySelect = ({
  value,
  onChange,
  trigger,
  className = "",
  wrapperClassName = "",
  align = "left",
  disabled = false,
}: CurrencySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: currencies } = useCurrencies();
  const { recents, addRecent } = useRecentCurrencies();

  // Close when clicking outside (fallback for trigger clicks)
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (code: string) => {
    onChange(code);
    addRecent(code);
    setIsOpen(false);
    setSearchQuery("");
  };

  const filteredCurrencies = currencies
    ? Object.entries(currencies).filter(
        ([code, name]) =>
          code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const recentCurrenciesList = filteredCurrencies
    .filter(([code]) => recents.includes(code))
    .sort((a, b) => recents.indexOf(a[0]) - recents.indexOf(b[0]));

  const popularCurrenciesList = filteredCurrencies.filter(
    ([code]) => POPULAR_CURRENCIES.includes(code) && !recents.includes(code)
  );
  
  const otherCurrenciesList = filteredCurrencies.filter(
    ([code]) => !POPULAR_CURRENCIES.includes(code) && !recents.includes(code)
  );

  const renderCurrencyItem = ([code, name]: [string, string]) => {
    const isSelected = value === code;
    return (
      <StaggerItem key={code}>
        <div className="flex items-center justify-between dark:hover:bg-neutral-500 hover:bg-neutral-300 transition-colors px-2 py-3 rounded-lg">
          <button
            type="button"
            role="option"
            aria-selected={isSelected}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              handleSelect(code);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleSelect(code);
              }
            }}
            className="flex items-center gap-3 text-left w-[90%] overflow-hidden cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 focus-visible:rounded-md"
          >
            <span className="text-xl leading-none shrink-0">{getFlagEmoji(code)}</span>
            <span className="font-normal text-neutral-50 text-sm shrink-0">{code}</span>
            <span
              className="text-[12px] text-neutral-400 truncate w-full"
              title={getCurrencyNote(code, name)}
            >
              {getCurrencyNote(code, name)}
            </span>
          </button>
          {isSelected && <FaCheck className="dark:text-lime-500 text-lime-700 shrink-0" />}
        </div>
      </StaggerItem>
    );
  };

  return (
    <div className={`relative inline-block w-full md:w-auto ${wrapperClassName}`} ref={dropdownRef}>
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearchQuery("");
          }
        }}
        className={`w-full h-full ${trigger ? "cursor-pointer" : ""}`}
      >
        {trigger ? (
          typeof trigger === "function" ? trigger(isOpen) : trigger
        ) : (
          <button
            type="button"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls="currency-listbox"
            disabled={disabled}
            className={`flex items-center justify-between gap-2 cursor-pointer w-full disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-lime-500 ${className}`}
          >
            <div className="flex items-center gap-2">
              {value ? (
                <>
                  <span className="text-base leading-none">{getFlagEmoji(value)}</span>
                  <span>{value}</span>
                </>
              ) : (
                <span>Select...</span>
              )}
            </div>
            <IoMdArrowDropdown className="text-neutral-200 shrink-0" />
          </button>
        )}
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              setSearchQuery("");
            }}
          />
          <div
            className={`absolute top-full mt-2 w-full min-w-[280px] max-w-[311px] max-h-[458px] overflow-y-auto bg-neutral-600 border border-neutral-400 radius-sm z-50 shadow-2xl flex flex-col p-2 gap-1 custom-scrollbar ${
              align === "right" ? "right-0" : "left-0"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full p-3 border border-neutral-200 rounded-[6px] flex items-center gap-2 mb-2.5">
              <IoIosSearch size={20} className="text-neutral-50 shrink-0" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                role="searchbox"
                aria-autocomplete="list"
                aria-controls="currency-listbox"
                className="border-none bg-transparent outline-none w-full placeholder:text-neutral-200 text-neutral-50"
                placeholder="Search currencies..."
              />
            </div>

            {currencies ? (
              <div role="listbox" id="currency-listbox" className="flex flex-col">
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
            ) : (
              <div className="p-4 text-center text-neutral-400 text-sm">
                Loading currencies...
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
