"use client"

import React, { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

interface TabsHeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const TabsHeader: React.FC<TabsHeaderProps> = ({ currentTab, setCurrentTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tabs = ["HISTORY", "COMPARE", "FAVORITES", "LOGS"];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mt-10 px-4">
      <div className="relative w-full" ref={dropdownRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="bg-neutral-700 border border-neutral-400 px-3 py-2 rounded-[8px] w-full cursor-pointer hover:opacity-90 flex items-center justify-between"
        >
          <div className="text-neutral-50 font-normal text-base">
            {currentTab}
          </div>
          <RiArrowDropDownLine 
            size={24} 
            className={`text-neutral-50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-neutral-700 border border-neutral-400 rounded-[8px] overflow-hidden z-10 shadow-lg">
            {tabs.map((tab, index) => (
              <div
                key={index}
                className={`text-neutral-50 font-normal text-base px-3 py-2 cursor-pointer hover:bg-neutral-600 transition-colors ${
                  currentTab === tab ? "bg-neutral-600" : ""
                }`}
                onClick={() => {
                  setCurrentTab(tab);
                  setIsOpen(false);
                }}
              >
                {tab}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsHeader;
