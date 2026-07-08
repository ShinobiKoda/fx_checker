"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import LiveMarkets from "@/components/LiveMarkets";
import Converter from "@/components/converter/Converter";
import TabsContainer from "@/components/tabs/TabsContainer";
import AuthModal from "@/components/auth/AuthModal";
import AuthBanner from "@/components/auth/AuthBanner";
import OfflineBanner from "@/components/ui/OfflineBanner";
import ShortcutsModal from "@/components/ui/ShortcutsModal";
import { FiAlertCircle } from "react-icons/fi";
import Loading from "@/components/ui/Loading";
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
  const [chartRange, setChartRange] = useState("1M");

  // eslint-disable-next-line react-hooks/exhaustive-deps -- Only run on mount to set initial home currency, not on every fromCurrency change
  useEffect(() => {
    if (!searchParams.get("from")) {
      const saved = localStorage.getItem("fx_home_currency");
      if (saved) {
        setFromCurrency(saved);
      }
    }
  }, []);

  // ── Live URL sync ────────────────────────────────────────────────────
  useEffect(() => {
    const timeout = setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set("from", fromCurrency);
      url.searchParams.set("to", toCurrency);
      if (amount) {
        url.searchParams.set("amount", amount);
      } else {
        url.searchParams.delete("amount");
      }
      window.history.replaceState(null, "", url.toString());
    }, 300);
    return () => clearTimeout(timeout);
  }, [fromCurrency, toCurrency, amount]);

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
    onSetChartRange: setChartRange,
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
        try {
          return JSON.parse(cached).timestamp;
        } catch {
          return undefined;
        }
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
        <div className="max-w-259 mx-auto px-4 pt-26 -mb-22">
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
      <TabsContainer
        base={fromCurrency}
        quote={toCurrency}
        amount={amount}
        setFromCurrency={setFromCurrency}
        setToCurrency={setToCurrency}
        chartRange={chartRange}
        setChartRange={setChartRange}
      />
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
      <button
        type="button"
        onClick={() => setIsShortcutsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsShortcutsOpen(true);
          }
        }}
        aria-label="Show keyboard shortcuts"
        className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 p-2 rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500 hidden lg:block"
      >
        <FiAlertCircle size={20} />
      </button>
    </div>
  );
}

export default function Page() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowIntro(false), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="fixed inset-0 z-9999"
          >
            <Loading />
          </motion.div>
        )}
      </AnimatePresence>
      <PageContent />
    </>
  );
}
