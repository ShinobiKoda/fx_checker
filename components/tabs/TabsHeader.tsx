"use client";

import React, { useState, useRef, useEffect } from "react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { DropdownMenu, AnimatedTabItem, SlideUp } from "@/components/Motion";
import { motion } from "framer-motion";

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
            <div className="text-neutral-50 font-normal text-base">
              {currentTab}
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
                {tab}
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
                <span className="w-5 h-5 rounded-full bg-lime-800 text-preset text-lime-500 text-center flex items-center justify-center">
                  10
                </span>
              </AnimatedTabItem>
            ))}
          </ul>

        </div>
      </div>
    </SlideUp>
  );
};

export default TabsHeader;
