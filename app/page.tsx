import React from "react";
import Header from "@/components/Header";
import LiveMarkets from "@/components/LiveMarkets";

function page() {
  return (
    <div className="bg-neutral-900 flex-1">
      <Header />
      <LiveMarkets />
      
    </div>
  );
}

export default page;
