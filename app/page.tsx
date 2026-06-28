"use client";

import { useState } from "react";
import Header from "@/components/Header";
import LiveMarkets from "@/components/LiveMarkets";
import Converter from "@/components/converter/Converter";
import TabsContainer from "@/components/tabs/TabsContainer";
import AuthModal from "@/components/auth/AuthModal";
import AuthBanner from "@/components/auth/AuthBanner";

function Page() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState<string>("1000");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleOpenAuth = () => setIsAuthModalOpen(true);

  return (
    <div className="bg-neutral-900 flex-1 relative min-h-screen">
      <Header onOpenAuth={handleOpenAuth} />
      <LiveMarkets />
      <Converter
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        setFromCurrency={setFromCurrency}
        setToCurrency={setToCurrency}
        amount={amount}
        setAmount={setAmount}
        onOpenAuth={handleOpenAuth}
      />
      <AuthBanner onOpenAuth={handleOpenAuth} />
      <TabsContainer base={fromCurrency} quote={toCurrency} amount={amount} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </div>
  );
}

export default Page;
