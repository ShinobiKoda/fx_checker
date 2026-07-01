"use client";

import React, { useState } from "react";
import TabsHeader from "./TabsHeader";
import History from "./History";
import Compare from "./Compare";
import Dashboard from "./Dashboard";
import Favorites from "./Favorites";
import Log from "./Log";
import Alerts from "./Alerts";
import Analytics from "./Analytics";
import Invoice from "./Invoice";
import UnitConverter from "../converter/UnitConverter";
import { useAlertPoller } from "@/hooks/useAlertPoller";

interface TabsContainerProps {
  base: string;
  quote: string;
  amount: string;
  setFromCurrency: (c: string) => void;
  setToCurrency: (c: string) => void;
  chartRange: string;
  setChartRange: (r: string) => void;
}

const TabsContainer = ({ base, quote, amount, setFromCurrency, setToCurrency, chartRange, setChartRange }: TabsContainerProps) => {
  const [currentTab, setCurrentTab] = useState("HISTORY");

  // Start polling for alerts globally when the app is open
  useAlertPoller();

  const renderTabContent = () => {
    switch (currentTab) {
      case "HISTORY":
        return <History base={base} quote={quote} activeDate={chartRange} setActiveDate={setChartRange} />;
      case "COMPARE":
        return <Compare base={base} amount={amount} />;
      case "DASHBOARD":
        return <Dashboard base={base} amount={amount} />;
      case "FAVORITES":
        return <Favorites amount={amount} onLoadPair={(from, to) => { setFromCurrency(from); setToCurrency(to); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />;
      case "LOGS":
        return <Log />;
      case "ALERTS":
        return <Alerts base={base} quote={quote} />;
      case "ANALYTICS":
        return <Analytics base={base} quote={quote} />;
      case "UNITS":
        return <UnitConverter />;
      case "INVOICE":
        return <Invoice />;
      default:
        return <History base={base} quote={quote} activeDate={chartRange} setActiveDate={setChartRange} />;
    }
  };

  return (
    <div>
      <TabsHeader currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

export default TabsContainer;
