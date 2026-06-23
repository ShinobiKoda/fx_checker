"use client";

import React, { useState } from "react";
import TabsHeader from "./TabsHeader";
import History from "./History";
import Compare from "./Compare";
import Favorites from "./Favorites";
import Log from "./Log";

const TabsContainer = () => {
  const [currentTab, setCurrentTab] = useState("HISTORY");

  const renderTabContent = () => {
    switch (currentTab) {
      case "HISTORY":
        return <History />;
      case "COMPARE":
        return <Compare />;
      case "FAVORITES":
        return <Favorites />;
      case "LOGS":
        return <Log />;
      default:
        return <History />;
    }
  };

  return (
    <div>
      <TabsHeader currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TabsContainer;
