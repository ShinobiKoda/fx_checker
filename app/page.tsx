"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import LiveMarkets from "@/components/LiveMarkets";
import Converter from "@/components/converter/Converter";
import TabsContainer from "@/components/tabs/TabsContainer";
import AuthModal from "@/components/auth/AuthModal";
import AuthBanner from "@/components/auth/AuthBanner";
import OfflineBanner from "@/components/ui/OfflineBanner";
import ShortcutsModal from "@/components/ui/ShortcutsModal";
import { useRates } from "@/hooks/useRates";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useRef } from "react";

function PageContent() {
  const searchParams = useSearchParams();
  
  const initialFrom = searchParams.get("from") || "USD";
  const initialTo = searchParams.get("to") || "EUR";
  const initialAmount = searchParams.get("amount") || "1000";

  const [fromCurrency, setFromCurrency] = useState(initialFrom);
  const [toCurrency, setToCurrency] = useState(initialTo);
  const [amount, setAmount] = useState<string>(initialAmount);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isReversed, setIsReversed] = useState(false);

  useEffect(() => {
    if (!searchParams.get("from")) {
      const saved = localStorage.getItem("fx_home_currency");
      if (saved && saved !== fromCurrency) {
        setFromCurrency(saved);
      }
    }
  }, [searchParams, fromCurrency]);

  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboardShortcuts({
    onSwap: () => {
      setFromCurrency(toCurrency);
      setToCurrency(fromCurrency);
    },
    onFocusInput: () => {
      inputRef.current?.focus();
    },
    onClear: () => {
      setAmount("");
      // Force empty display value in the Converter component by firing a synthetic-like clear if needed, or Converter can derive from `amount`. We'll handle this inside Converter by syncing displayAmount.
    },
    onToggleReverse: () => setIsReversed((v) => !v),
    onToggleShortcuts: () => setIsShortcutsOpen((v) => !v),
  });

  const { data: rates } = useRates([fromCurrency]);
  const cachedAt = rates && rates.length > 0 ? rates[0].cached_at : undefined;

  // Detect online/offline status changes
  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    
    setIsOffline(!navigator.onLine);
    
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  // Get cache timestamp for offline banner
  const offlineCacheTimestamp = (() => {
    if (!isOffline) return undefined;
    if (cachedAt) return cachedAt;
    // Try to read directly from localStorage
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem(`fx_rates_cache_${fromCurrency}`);
      if (cached) {
        try { return JSON.parse(cached).timestamp; } catch { return undefined; }
      }
    }
    return undefined;
  })();

  const handleOpenAuth = () => setIsAuthModalOpen(true);

  return (
    <div className="bg-neutral-900 flex-1 relative min-h-screen">
      <Header onOpenAuth={handleOpenAuth} />
      <LiveMarkets />
      {(cachedAt || offlineCacheTimestamp) && (
        <div className="max-w-[1036px] mx-auto px-4 pt-[104px] mb-[-88px]">
          <OfflineBanner cachedAt={(cachedAt || offlineCacheTimestamp)!} />
        </div>
      )}
      <Converter
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        setFromCurrency={setFromCurrency}
        setToCurrency={setToCurrency}
        amount={amount}
        setAmount={setAmount}
        onOpenAuth={handleOpenAuth}
        inputRef={inputRef}
        isReversed={isReversed}
        setIsReversed={setIsReversed}
      />
      <AuthBanner onOpenAuth={handleOpenAuth} />
      <TabsContainer base={fromCurrency} quote={toCurrency} amount={amount} setFromCurrency={setFromCurrency} setToCurrency={setToCurrency} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <ShortcutsModal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="bg-neutral-900 min-h-screen flex items-center justify-center text-neutral-500">
        Loading...
      </div>
    }>
      <PageContent />
    </Suspense>
  );
}
