"use client";

import React, { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { DropdownMenu, AnimatedTabItem, SlideUp } from "@/components/Motion";
import { motion } from "framer-motion";
import { useFavorites } from "@/hooks/useFavorites";
import { useConversionLogs } from "@/hooks/useConversionLog";

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
  const { data: favorites } = useFavorites();
  const favCount = favorites?.length || 0;
  
  const { data: logs } = useConversionLogs();
  const logCount = logs?.length || 0;

  const tabs = ["HISTORY", "COMPARE", "DASHBOARD", "FAVORITES", "LOGS", "ALERTS"];

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
    <SlideUp delay={0.5} duration={0.6}>
      <div className="mt-10 px-4 max-w-[1036px] mx-auto">
        <div className="relative w-full" ref={dropdownRef}>

          {/* ── Mobile trigger ───────────────────────────────── */}
          <motion.div
            onClick={() => setIsOpen(!isOpen)}
            className="bg-neutral-700 border border-neutral-400 px-3 py-2 radius-sm w-full cursor-pointer flex items-center justify-between md:hidden"
            whileHover={{ backgroundColor: "rgba(82,82,82,0.9)" }}
            whileTap={{ scale: 0.99 }}
            transition={{ duration: 0.15 }}
          >
            <div className="text-neutral-50 font-normal text-base flex items-center gap-2">
              {currentTab}
              {currentTab === "FAVORITES" && favCount > 0 && (
                <span className="w-5 h-5 rounded-full dark:bg-lime-800 bg-lime-200 text-preset dark:text-lime-500 text-lime-700 text-center flex items-center justify-center">
                  {favCount}
                </span>
              )}
              {currentTab === "LOGS" && logCount > 0 && (
                <span className="w-5 h-5 rounded-full dark:bg-lime-800 bg-lime-200 text-preset dark:text-lime-500 text-lime-700 text-center flex items-center justify-center">
                  {logCount}
                </span>
              )}
            </div>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <RiArrowDropDownLine size={24} className="text-neutral-50" />
            </motion.span>
          </motion.div>

          {/* ── Mobile dropdown ──────────────────────────────── */}
          <DropdownMenu
            isOpen={isOpen}
            className="absolute top-full left-0 mt-1 w-full bg-neutral-700 border border-neutral-400 radius-sm overflow-hidden z-10 shadow-xl"
          >
            {tabs.map((tab, index) => (
              <motion.div
                key={index}
                className={`text-neutral-50 font-normal text-base px-3 py-2 cursor-pointer transition-colors ${
                  currentTab === tab ? "bg-neutral-600" : ""
                }`}
                whileHover={{ backgroundColor: "rgba(82,82,82,1)" }}
                onClick={() => {
                  setCurrentTab(tab);
                  setIsOpen(false);
                }}
              >
                <div className="flex items-center gap-2">
                  {tab}
                  {tab === "FAVORITES" && favCount > 0 && (
                    <span className="w-5 h-5 rounded-full dark:bg-lime-800 bg-lime-200 text-preset dark:text-lime-500 text-lime-700 text-center flex items-center justify-center">
                      {favCount}
                    </span>
                  )}
                  {tab === "LOGS" && logCount > 0 && (
                    <span className="w-5 h-5 rounded-full dark:bg-lime-800 bg-lime-200 text-preset dark:text-lime-500 text-lime-700 text-center flex items-center justify-center">
                      {logCount}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </DropdownMenu>

          {/* ── Desktop tab bar ──────────────────────────────── */}
          <ul className="md:flex md:items-center gap-2 hidden border-b border-b-neutral-600">
            {tabs.map((tab, index) => (
              <AnimatedTabItem
                key={index}
                isActive={currentTab === tab}
                onClick={() => setCurrentTab(tab)}
              >
                <span>{tab}</span>
                {tab === "FAVORITES" && favCount > 0 && (
                  <span className="w-5 h-5 rounded-full dark:bg-lime-800 bg-lime-200 text-preset dark:text-lime-500 text-lime-700 text-center flex items-center justify-center">
                    {favCount}
                  </span>
                )}
                {tab === "LOGS" && logCount > 0 && (
                  <span className="w-5 h-5 rounded-full dark:bg-lime-800 bg-lime-200 text-preset dark:text-lime-500 text-lime-700 text-center flex items-center justify-center">
                    {logCount}
                  </span>
                )}
              </AnimatedTabItem>
            ))}
          </ul>

        </div>
      </div>
    </SlideUp>
  );
};

export default TabsHeader;
