import React from "react";
import { SlideUp } from "@/components/Motion";
import BigMacIndex from "@/components/analytics/BigMacIndex";
import StrengthIndex from "@/components/analytics/StrengthIndex";
import CorrelationTracker from "@/components/analytics/CorrelationTracker";
import RecurringTracker from "@/components/analytics/RecurringTracker";

interface AnalyticsProps {
  base: string;
  quote: string;
}

const Analytics = ({ base, quote }: AnalyticsProps) => {
  return (
    <div className="w-full max-w-[1036px] mx-auto px-4 mt-6 pb-8 md:pb-[48px]">
      <SlideUp delay={0.1} distance={20}>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-neutral-50 mb-2">Market Analytics</h2>
          <p className="text-neutral-200 text-sm">Advanced institutional-grade tools to track currency momentum and purchasing power.</p>
        </div>
      </SlideUp>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StrengthIndex />
        <BigMacIndex />
        <CorrelationTracker />
        <RecurringTracker />
      </div>
    </div>
  );
};

export default Analytics;
