import React from "react";
import Header from "@/components/Header";
import LiveMarkets from "@/components/LiveMarkets";
import Converter from "@/components/converter/Converter";
import TabsHeader from "@/components/tabs/TabsHeader";

function page() {
  return (
    <div className="bg-neutral-900 flex-1">
      <Header />
      <LiveMarkets />
        <Converter />
      <TabsHeader />
    </div>
  );
}

export default page;
