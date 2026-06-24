"use client";

import React, { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

interface TabsHeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

const TabsHeader: React.FC<TabsHeaderProps> = ({
  currentTab,
  setCurrentTab,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [tabletTab, setTabletTab] = useState('HISTORY');

  const tabs = ["HISTORY", "COMPARE", "FAVORITES", "LOGS"];

  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
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
          className="bg-neutral-700 border border-neutral-400 px-3 py-2 border-sm w-full cursor-pointer hover:opacity-90 flex items-center justify-between md:hidden"
        >
          <div className="text-neutral-50 font-normal text-base">
            {currentTab}
          </div>
          <RiArrowDropDownLine
            size={24}
            className={`text-neutral-50 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        <ul className="md:flex md:items-center gap-2 hidden border-b border-b-neutral-600">
          {tabs.map((tab, index) => (
            <li className={`px-4 py-[10.5px] flex items-center gap-1 cursor-pointer font-normal text-base text-neutral-50 ${tabletTab == tab ? "border-b border-b-lime-500": ""}`} key={index} onClick={()=> setTabletTab(tab)}>
              <span>{tab}</span>
              <span className="w-5 h-5 rounded-full bg-lime-800 text-preset text-lime-500 text-center flex items-center justify-center">10</span>
            </li>
          ))}
        </ul>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-full bg-neutral-700 border border-neutral-400 border-sm overflow-hidden z-10 shadow-lg">
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
