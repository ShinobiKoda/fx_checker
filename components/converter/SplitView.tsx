"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { CurrencySelect } from "@/components/ui/CurrencySelect";
import { getFlagEmoji } from "@/lib/utils";

interface SplitTarget {
  id: string;
  currency: string;
  percentage: number;
}

interface SplitViewProps {
  amount: string;
  fromCurrency: string;
  rates: any[];
}

export const SplitView = ({ amount, fromCurrency, rates }: SplitViewProps) => {
  // Default to 3 equal splits of common currencies
  const [targets, setTargets] = useState<SplitTarget[]>([
    { id: "1", currency: "USD", percentage: 33.33 },
    { id: "2", currency: "GBP", percentage: 33.33 },
    { id: "3", currency: "EUR", percentage: 33.34 },
  ]);
  

  // Re-calculate equal splits
  const equalizeSplits = (currentTargets: SplitTarget[]) => {
    if (currentTargets.length === 0) return currentTargets;
    const basePct = Math.floor((100 / currentTargets.length) * 100) / 100;
    const remainder = 100 - (basePct * currentTargets.length);
    
    return currentTargets.map((t, i) => ({
      ...t,
      percentage: i === currentTargets.length - 1 ? Number((basePct + remainder).toFixed(2)) : basePct
    }));
  };

  const handleEqualize = () => {
    setTargets(equalizeSplits(targets));
  };

  const addTarget = (currency: string) => {
    const newTargets = [...targets, { id: Math.random().toString(), currency, percentage: 0 }];
    setTargets(equalizeSplits(newTargets));
  };

  const removeTarget = (id: string) => {
    const newTargets = targets.filter(t => t.id !== id);
    setTargets(equalizeSplits(newTargets));
  };

  const updatePercentage = (id: string, newPct: number) => {
    // Basic custom percentage update (for a full implementation, you'd auto-balance the rest)
    setTargets(targets.map(t => t.id === id ? { ...t, percentage: newPct } : t));
  };

  const totalAmount = Number(amount) || 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-neutral-50 font-medium">Split Distribution</h3>
        <button 
          onClick={handleEqualize}
          className="text-xs font-medium dark:text-lime-500 text-lime-700 dark:hover:text-lime-400 hover:text-lime-800 bg-lime-500/10 px-2 py-1 rounded"
        >
          Equalize %
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AnimatePresence>
          {targets.map((target) => {
            const rateItem = rates?.find(r => r.quote === target.currency);
            const rate = rateItem ? rateItem.rate : 0;
            const splitAmountBase = totalAmount * (target.percentage / 100);
            const convertedAmount = splitAmountBase * rate;

            return (
              <motion.div
                key={target.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-neutral-600 border border-neutral-500 rounded-2xl p-4 relative group"
              >
                <button 
                  onClick={() => removeTarget(target.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-neutral-700 rounded-full flex items-center justify-center text-neutral-400 hover:text-red-400 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <IoMdClose size={14} />
                </button>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="text-xl leading-none">{getFlagEmoji(target.currency)}</div>
                  <span className="font-medium text-neutral-50">{target.currency}</span>
                </div>
                
                <div className="text-2xl font-bold dark:text-lime-500 text-lime-700 mb-1 truncate" title={convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}>
                  {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                
                <div className="flex items-center justify-between mt-4 text-sm">
                  <span className="text-neutral-400">{splitAmountBase.toLocaleString(undefined, { maximumFractionDigits: 0 })} {fromCurrency}</span>
                  <div className="flex items-center gap-1 bg-neutral-700 px-2 py-1 rounded-md">
                    <input 
                      type="number"
                      value={target.percentage}
                      onChange={(e) => updatePercentage(target.id, Number(e.target.value))}
                      className="bg-transparent w-10 text-right text-neutral-50 outline-none text-xs"
                      min="0"
                      max="100"
                    />
                    <span className="text-neutral-400 text-xs">%</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {targets.length < 5 && (
          <div className="relative h-full">
            <CurrencySelect
              onChange={addTarget}
              wrapperClassName="h-full"
              trigger={(isOpen) => (
                <button
                  className={`w-full h-full min-h-[120px] p-4 bg-neutral-600/50 border border-neutral-500 border-dashed rounded-2xl flex flex-col items-center justify-center text-neutral-400 transition-colors cursor-pointer ${
                    isOpen ? "bg-neutral-600 text-neutral-200" : "hover:bg-neutral-600 hover:text-neutral-200"
                  }`}
                >
                  <IoMdAdd size={24} className="mb-2" />
                  <span className="text-sm font-medium">Add Currency</span>
                </button>
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
};
