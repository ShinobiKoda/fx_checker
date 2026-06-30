"use client";

import React, { useState } from "react";
import { SlideUp, ShimmerBlock, ErrorBanner } from "@/components/Motion";
import { useCurrencies } from "@/hooks/useCurrencies";
import { useRates } from "@/hooks/useRates";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface LineItem {
  id: string;
  description: string;
  amount: string;
  currency: string;
}

const Invoice = () => {
  const [homeCurrency, setHomeCurrency] = useState("USD");
  const [clientCurrency, setClientCurrency] = useState("EUR");
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "Web Development", amount: "1000", currency: "EUR" },
  ]);

  const { data: currencies, isLoading: currenciesLoading } = useCurrencies();
  const { data: rates, isLoading: ratesLoading, isError: ratesError } = useRates([homeCurrency]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: "", amount: "", currency: clientCurrency }
    ]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter(item => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string) => {
    setLineItems(lineItems.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const calculateConvertedAmount = (amountStr: string, currency: string) => {
    const amount = Number(amountStr);
    if (isNaN(amount) || amount === 0) return 0;
    if (currency === homeCurrency) return amount;
    
    if (!rates) return 0;
    const rateItem = rates.find(r => r.base === homeCurrency && r.quote === currency);
    if (!rateItem) return 0;

    return amount / rateItem.rate;
  };

  const calculateTotal = () => {
    return lineItems.reduce((total, item) => {
      return total + calculateConvertedAmount(item.amount, item.currency);
    }, 0);
  };

  const calculateClientTotal = () => {
    // If all line items are the client currency, just sum them up directly.
    return lineItems.reduce((total, item) => {
      if (item.currency === clientCurrency) return total + Number(item.amount || 0);
      
      // If a line item is in another currency, convert it to clientCurrency.
      // First, convert it to homeCurrency
      const inHome = calculateConvertedAmount(item.amount, item.currency);
      
      // Then to clientCurrency
      if (clientCurrency === homeCurrency) return total + inHome;
      
      const rateItem = rates?.find(r => r.base === homeCurrency && r.quote === clientCurrency);
      if (!rateItem) return total;
      
      return total + (inHome * rateItem.rate);
    }, 0);
  };

  if (currenciesLoading || ratesLoading) {
    return (
      <div className="max-w-[1036px] mx-auto px-4 mt-8">
        <ShimmerBlock height="400px" width="100%" rounded="20px" />
      </div>
    );
  }

  if (ratesError) {
    return (
      <div className="max-w-[1036px] mx-auto px-4 mt-8">
        <ErrorBanner message="Failed to load exchange rates for invoice calculator." />
      </div>
    );
  }

  const currencyOptions = currencies ? Object.keys(currencies).sort() : [];
  const totalInHome = calculateTotal();
  const totalInClient = calculateClientTotal();

  return (
    <SlideUp delay={0.1} duration={0.6}>
      <div className="max-w-[1036px] mx-auto px-4 mt-8 pb-8 md:pb-[48px]">
        <div className="bg-neutral-700 rounded-[20px] p-6 space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-neutral-600 pb-6">
            <div>
              <h2 className="text-xl font-medium text-neutral-50 mb-1">Invoice Calculator</h2>
              <p className="text-sm text-neutral-400">Calculate multi-currency totals for your invoices.</p>
            </div>
            
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="flex flex-col gap-1.5 w-full md:w-32">
                <label className="text-xs text-neutral-400 font-medium">Home Currency</label>
                <select 
                  value={homeCurrency} 
                  onChange={(e) => setHomeCurrency(e.target.value)}
                  className="bg-neutral-600 border border-neutral-500 rounded-lg px-3 py-2 text-neutral-50 text-sm outline-none focus:border-lime-500 cursor-pointer w-full"
                >
                  {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1.5 w-full md:w-32">
                <label className="text-xs text-neutral-400 font-medium">Client Currency</label>
                <select 
                  value={clientCurrency} 
                  onChange={(e) => setClientCurrency(e.target.value)}
                  className="bg-neutral-600 border border-neutral-500 rounded-lg px-3 py-2 text-neutral-50 text-sm outline-none focus:border-lime-500 cursor-pointer w-full"
                >
                  {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 text-xs font-medium text-neutral-400">
              <div>Description</div>
              <div>Amount</div>
              <div>Currency</div>
              <div className="w-8"></div>
            </div>

            <AnimatePresence>
              {lineItems.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_auto] gap-4 bg-neutral-600 p-4 rounded-xl border border-neutral-500 items-center"
                >
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, "description", e.target.value)}
                    placeholder="Item description"
                    className="bg-neutral-700 border border-neutral-500 rounded-lg px-3 py-2 text-neutral-50 text-sm outline-none focus:border-lime-500 w-full"
                  />
                  
                  <div className="relative">
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => updateLineItem(item.id, "amount", e.target.value)}
                      placeholder="0.00"
                      className="bg-neutral-700 border border-neutral-500 rounded-lg px-3 py-2 text-neutral-50 text-sm outline-none focus:border-lime-500 w-full"
                    />
                  </div>

                  <select
                    value={item.currency}
                    onChange={(e) => updateLineItem(item.id, "currency", e.target.value)}
                    className="bg-neutral-700 border border-neutral-500 rounded-lg px-3 py-2 text-neutral-50 text-sm outline-none focus:border-lime-500 cursor-pointer w-full"
                  >
                    {currencyOptions.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>

                  <button 
                    onClick={() => removeLineItem(item.id)}
                    className="w-10 h-10 flex items-center justify-center text-neutral-400 hover:text-red-400 bg-neutral-700 hover:bg-neutral-800 rounded-lg border border-neutral-500 transition-colors"
                  >
                    <FiTrash2 />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <button 
              onClick={addLineItem}
              className="flex items-center gap-2 text-sm font-medium text-lime-500 hover:text-lime-400 px-4 py-2"
            >
              <FiPlus /> Add Line Item
            </button>
          </div>

          <div className="border-t border-neutral-600 border-dashed pt-6 mt-6">
            <div className="flex flex-col md:flex-row items-end justify-between gap-6">
              <div className="w-full md:w-auto p-4 bg-neutral-600 rounded-xl border border-neutral-500 flex flex-col gap-1">
                <span className="text-xs text-neutral-400 font-medium">Total to Bill Client</span>
                <span className="text-2xl font-bold text-neutral-50">
                  {totalInClient.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {clientCurrency}
                </span>
              </div>
              
              <div className="w-full md:w-auto p-5 bg-neutral-800 rounded-xl border border-lime-500/30 flex flex-col gap-1 items-end">
                <span className="text-xs text-lime-500/80 font-medium">Your Earnings (Home)</span>
                <span className="text-3xl font-bold text-lime-500">
                  {totalInHome.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {homeCurrency}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </SlideUp>
  );
};

export default Invoice;
