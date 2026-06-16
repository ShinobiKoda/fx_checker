import React from "react";
import Header from "@/components/Header";
import LiveMarkets from "@/components/LiveMarkets";
import Converter from "@/components/converter/Converter";

function page() {
  return (
    <div className="bg-neutral-900 flex-1">
      <Header />
      <LiveMarkets />
      <div className="px-4 py-8">
        <Converter />
      </div>
      
    </div>
  );
}

export default page;
