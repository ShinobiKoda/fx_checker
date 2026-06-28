"use client";

import { useState } from "react";
import Header from "@/components/Header";
import LiveMarkets from "@/components/LiveMarkets";
import Converter from "@/components/converter/Converter";
import TabsContainer from "@/components/tabs/TabsContainer";

function Page() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState<string>("1000");

  return (
    <div className="bg-neutral-900 flex-1">
      <Header />
      <LiveMarkets />
      <Converter
        fromCurrency={fromCurrency}
        toCurrency={toCurrency}
        setFromCurrency={setFromCurrency}
        setToCurrency={setToCurrency}
        amount={amount}
        setAmount={setAmount}
      />
      <TabsContainer base={fromCurrency} quote={toCurrency} amount={amount} />
    </div>
  );
}

export default Page;
