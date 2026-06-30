"use client";

import React, { useState, useEffect } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheck } from "react-icons/fa6";
import { SlideUp, SwapButton, StaggerContainer, StaggerItem } from "@/components/Motion";
import { UnitCategory, getUnitCategories, getUnitsByCategory, getUnitById, convertUnit } from "@/lib/units";

const formatWithCommas = (value: string) => {
  const parts = value.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

const parseCommas = (value: string) => value.replace(/,/g, "");

interface UnitConverterProps {}

const UnitConverter = () => {
  const [amount, setAmount] = useState<string>("1000");
  const [isReversed, setIsReversed] = useState<boolean>(false);
  const [displayAmount, setDisplayAmount] = useState<string>("1,000");
  const [category, setCategory] = useState<UnitCategory>("weight");
  
  // Default units based on category
  const defaultUnits: Record<UnitCategory, {from: string, to: string}> = {
    weight: { from: "kg", to: "lb" },
    distance: { from: "km", to: "mi" },
    temperature: { from: "C", to: "F" },
  };

  const [fromUnit, setFromUnit] = useState(defaultUnits.weight.from);
  const [toUnit, setToUnit] = useState(defaultUnits.weight.to);
  const [dropdownOpen, setDropdownOpen] = useState<"from" | "to" | null>(null);
  const [showFullAmount, setShowFullAmount] = useState(false);

  // Update units when category changes
  useEffect(() => {
    setFromUnit(defaultUnits[category].from);
    setToUnit(defaultUnits[category].to);
  }, [category]);

  useEffect(() => {
    if (amount === "") {
      setDisplayAmount("");
    } else {
      setDisplayAmount(formatWithCommas(amount));
    }
  }, [amount]);

  const handleSwap = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
  };

  const getRawCalculatedNumber = () => {
    if (!amount || isNaN(Number(amount))) return 0;
    
    const numAmount = Number(amount);
    
    if (isReversed) {
      return convertUnit(numAmount, toUnit, fromUnit);
    } else {
      return convertUnit(numAmount, fromUnit, toUnit);
    }
  };

  const getCalculatedString = () => {
    const val = getRawCalculatedNumber();
    if (val === 0) return "0.00";
    return val.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  };

  const getRateString = () => {
    if (fromUnit === toUnit) return `1 ${fromUnit} = 1.0000 ${toUnit}`;
    const rate = convertUnit(1, fromUnit, toUnit);
    return `1 ${fromUnit} = ${rate.toFixed(4)} ${toUnit}`;
  };

  const renderUnitDropdown = (type: "from" | "to") => {
    if (dropdownOpen !== type) return null;

    const units = getUnitsByCategory(category);

    return (
      <>
        <div
          className="fixed inset-0 z-40"
          onClick={() => setDropdownOpen(null)}
        />
        <div
          className="absolute top-full right-0 mt-2 w-[220px] max-h-[300px] overflow-y-auto bg-neutral-600 border border-neutral-400 radius-sm z-50 shadow-2xl flex flex-col p-2 gap-1 custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          <StaggerContainer staggerDelay={0.02} className="flex flex-col gap-1">
            {units.map((unit) => {
              const isSelected = (type === "from" ? fromUnit : toUnit) === unit.id;
              return (
                <StaggerItem key={unit.id}>
                  <div className="flex items-center justify-between hover:bg-neutral-500 transition-colors px-2 py-3 rounded-lg">
                    <button
                      onClick={() => {
                        if (type === "from") setFromUnit(unit.id);
                        else setToUnit(unit.id);
                        setDropdownOpen(null);
                      }}
                      className="flex flex-col text-left w-full overflow-hidden"
                    >
                      <span className="font-normal text-neutral-50 text-sm">{unit.name} ({unit.symbol})</span>
                    </button>
                    {isSelected && <FaCheck className="dark:text-lime-500 text-lime-700 shrink-0" />}
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </>
    );
  };

  const renderAmountBlock = (isInput: boolean) => {
    if (isInput) {
      return (
        <input
          type="text"
          value={displayAmount}
          onChange={(e) => {
            const val = e.target.value;
            const rawValue = parseCommas(val);
            if (/^-?\d*\.?\d*$/.test(rawValue)) { // Allow negative for temperature
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

  const currentFromUnit = getUnitById(fromUnit);
  const currentToUnit = getUnitById(toUnit);

  return (
    <SlideUp delay={0.1} duration={0.6}>
      <div className="max-w-[1036px] mx-auto px-4 mt-8 pb-8 md:pb-[48px]">
        <div className="flex bg-neutral-700 rounded-full p-1 max-w-[300px] mb-6 border border-neutral-600">
          {getUnitCategories().map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-1 py-1.5 px-4 text-xs font-medium rounded-full transition-all capitalize cursor-pointer ${category === cat ? "bg-lime-500 text-black shadow-sm" : "text-neutral-300 hover:text-neutral-100"}`}
            >
              {cat}
            </button>
          ))}
        </div>
        
        <div className="bg-neutral-700 rounded-[20px]">
          <div className="p-4 space-y-4 flex flex-col items-center justify-center w-full md:flex-row md:gap-6 md:justify-between md:items-center">
            
            <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full relative md:max-w-[292px] lg:max-w-[450px]">
              <h4 className="text-neutral-100 font-normal text-sm">FROM</h4>
              <div className="flex items-start justify-between gap-2">
                {renderAmountBlock(!isReversed)}
                <div className="relative">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === "from" ? null : "from")
                    }
                    className="p-[10px] radius-sm bg-neutral-500 border border-neutral-400 flex items-center gap-2 hover:bg-neutral-400 transition-colors cursor-pointer"
                  >
                    <span className="font-normal text-sm text-neutral-50 min-w-[30px] text-center">
                      {currentFromUnit?.symbol}
                    </span>
                    <motion.span
                      animate={{ rotate: dropdownOpen === 'from' ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      style={{ display: 'flex' }}
                    >
                      <IoMdArrowDropdown className="text-neutral-50" />
                    </motion.span>
                  </button>
                  {renderUnitDropdown("from")}
                </div>
              </div>
            </div>

            <SwapButton onClick={handleSwap} />

            <div className="rounded-2xl p-4 bg-neutral-600 border border-neutral-500 space-y-5 w-full relative md:max-w-[292px] lg:max-w-[450px]">
              <h4 className="text-neutral-100 font-normal text-sm">TO</h4>
              <div className="flex items-start justify-between gap-2">
                {renderAmountBlock(isReversed)}
                <div className="relative shrink-0">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === "to" ? null : "to")
                    }
                    className="p-[10px] radius-sm bg-neutral-500 border border-neutral-400 flex items-center gap-2 hover:bg-neutral-400 transition-colors cursor-pointer"
                  >
                    <span className="font-normal text-sm text-neutral-50 min-w-[30px] text-center">
                      {currentToUnit?.symbol}
                    </span>
                    <motion.span
                      animate={{ rotate: dropdownOpen === 'to' ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      style={{ display: 'flex' }}
                    >
                      <IoMdArrowDropdown className="text-neutral-50" />
                    </motion.span>
                  </button>
                  {renderUnitDropdown("to")}
                </div>
              </div>
            </div>

          </div>
          
          <div className="w-full border border-neutral-500 border-dashed h-px"></div>
          <div className="p-4 text-center flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between">
            <div className="flex items-center gap-3">
              <p className="text-neutral-50 text-preset md:text-[12px]">{getRateString()}</p>
              <button
                onClick={() => setIsReversed(!isReversed)}
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
          </div>
        </div>
      </div>
    </SlideUp>
  );
};

export default UnitConverter;
