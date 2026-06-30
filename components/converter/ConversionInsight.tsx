import React from "react";
import { useHistory } from "@/hooks/useHistory";
import { SlideUp, ShimmerBlock } from "@/components/Motion";

interface ConversionInsightProps {
  base: string;
  quote: string;
  currentRate: number;
}

export const ConversionInsight = ({ base, quote, currentRate }: ConversionInsightProps) => {
  // Fetch 3M data to derive insights
  const { data: history, isLoading } = useHistory(base, quote, "3M");

  if (isLoading) {
    return (
      <div className="w-full mt-4 px-4">
        <div className="bg-neutral-800/50 border border-neutral-600 rounded-xl p-3">
          <ShimmerBlock width="100%" height="20px" rounded="4px" />
        </div>
      </div>
    );
  }

  if (!history || history.data.length < 30) return null;

  // Calculate 30-day average
  const last30Days = history.data.slice(-30);
  const thirtyDayAvg = last30Days.reduce((acc, val) => acc + val.rate, 0) / last30Days.length;

  // Calculate 90-day high and low
  const rates = history.data.map((d) => d.rate);
  const ninetyDayHigh = Math.max(...rates);
  const ninetyDayLow = Math.min(...rates);

  // Generate Insights
  let insightText = "";
  let icon = "💡";
  let color = "text-neutral-200";

  // Threshold for "near" high/low (e.g., within 0.5%)
  const threshold = (ninetyDayHigh - ninetyDayLow) * 0.05;

  if (Math.abs(currentRate - ninetyDayHigh) < threshold) {
    insightText = `This rate is near a 90-day high. Great time to convert!`;
    icon = "🔥";
    color = "dark:text-green-400 text-green-600";
  } else if (Math.abs(currentRate - ninetyDayLow) < threshold) {
    insightText = `This rate is near a 90-day low.`;
    icon = "⚠️";
    color = "dark:text-red-400 text-red-600";
  } else {
    // Compare against 30-day average
    const diffPercent = ((currentRate - thirtyDayAvg) / thirtyDayAvg) * 100;
    if (diffPercent > 1) {
      insightText = `You're getting ${diffPercent.toFixed(1)}% more ${quote} than the 30-day average.`;
      icon = "📈";
      color = "dark:text-green-400 text-green-600";
    } else if (diffPercent < -1) {
      insightText = `You're getting ${Math.abs(diffPercent).toFixed(1)}% less ${quote} than the 30-day average.`;
      icon = "📉";
      color = "dark:text-red-400 text-red-600";
    } else {
      insightText = `This rate is hovering right around the 30-day average.`;
      icon = "⚖️";
      color = "dark:text-neutral-400 text-neutral-600";
    }
  }

  return (
    <SlideUp delay={0.2} distance={10}>
      <div className="w-full mt-4">
        <div className="bg-neutral-800/80 backdrop-blur-sm border border-neutral-600 rounded-xl px-4 py-3 flex items-center justify-center gap-3">
          <div className="text-lg">{icon}</div>
          <div className={`text-xs md:text-sm font-medium ${color}`}>
            {insightText}
          </div>
        </div>
      </div>
    </SlideUp>
  );
};
