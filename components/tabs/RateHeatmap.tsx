import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HistoryDataPoint } from "@/hooks/useHistory";

interface RateHeatmapProps {
  data: HistoryDataPoint[];
}

interface HeatmapDay {
  date: string;
  rate: number;
  level: number;
}

export const RateHeatmap = ({ data }: RateHeatmapProps) => {
  const [hoveredDay, setHoveredDay] = useState<{ day: HeatmapDay; x: number; y: number } | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heatmapData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const startDate = new Date(sortedData[0].date);
    const endDate = new Date(sortedData[sortedData.length - 1].date);
    
    const continuousData: { date: string; rate: number }[] = [];
    let currentDate = new Date(startDate);
    let lastRate = sortedData[0].rate;

    while (currentDate <= endDate) {
      const dateString = currentDate.toISOString().split("T")[0];
      const dataPoint = sortedData.find((d) => d.date === dateString);
      
      if (dataPoint) {
        lastRate = dataPoint.rate;
      }
      
      continuousData.push({
        date: dateString,
        rate: lastRate,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Find min and max to calculate intensity levels
    const rates = continuousData.map((d) => d.rate);
    const min = Math.min(...rates);
    const max = Math.max(...rates);
    const range = max - min;

    // Map to levels 0-4
    return continuousData.map((day) => {
      let level = 2; // Default to neutral
      if (range > 0) {
        // Normalize between 0 and 1
        const normalized = (day.rate - min) / range;
        if (normalized < 0.2) level = 0; // Very Low
        else if (normalized < 0.45) level = 1; // Low
        else if (normalized < 0.55) level = 2; // Neutral
        else if (normalized < 0.8) level = 3; // High
        else level = 4; // Very High
      }

      return {
        ...day,
        level,
      };
    });
  }, [data]);

  const getColorClass = (level: number) => {
    switch (level) {
      case 0: return "bg-red-500 border-red-600";
      case 1: return "bg-red-900 border-red-950";
      case 2: return "bg-neutral-600 border-neutral-700";
      case 3: return "bg-lime-900 border-lime-950";
      case 4: return "bg-lime-500 border-lime-600";
      default: return "bg-neutral-600 border-neutral-700";
    }
  };

  // Group into weeks (columns)
  // Assuming 7 days a week, starting from Sunday
  const weeks: HeatmapDay[][] = [];
  let currentWeek: HeatmapDay[] = [];

  // Pad the first week if it doesn't start on Sunday (0)
  if (heatmapData.length > 0) {
    const firstDayOfWeek = new Date(heatmapData[0].date).getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push({ date: "", rate: 0, level: -1 }); // Empty filler
    }
  }

  heatmapData.forEach((day) => {
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });

  if (currentWeek.length > 0) {
    // Pad the last week
    while (currentWeek.length < 7) {
      currentWeek.push({ date: "", rate: 0, level: -1 });
    }
    weeks.push(currentWeek);
  }

  const handleMouseEnter = (e: React.MouseEvent, day: HeatmapDay) => {
    if (day.level === -1) return;
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    // Position tooltip above the square
    setHoveredDay({
      day,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
  };

  if (!heatmapData || heatmapData.length === 0) {
    return <div className="text-neutral-400 text-sm py-10 text-center">No data available for heatmap.</div>;
  }

  return (
    <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex flex-col min-w-max">
        {/* Days of week labels */}
        <div className="flex gap-1 mb-2">
          <div className="w-8 flex flex-col justify-between text-[10px] text-neutral-400 font-medium py-1">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          
          <div className="flex gap-1">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) => (
                  <div
                    key={`${weekIdx}-${dayIdx}`}
                    onMouseEnter={(e) => handleMouseEnter(e, day)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`w-3.5 h-3.5 md:w-4 md:h-4 rounded-sm border transition-all duration-200 cursor-crosshair ${
                      day.level === -1 
                        ? "bg-transparent border-transparent" 
                        : `${getColorClass(day.level)} hover:scale-125 hover:z-10 hover:shadow-lg relative`
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-end gap-2 text-[10px] text-neutral-400 mt-2 font-medium">
          <span>Weaker</span>
          <div className="flex gap-1">
            <div className={`w-3 h-3 rounded-sm border ${getColorClass(0)}`}></div>
            <div className={`w-3 h-3 rounded-sm border ${getColorClass(1)}`}></div>
            <div className={`w-3 h-3 rounded-sm border ${getColorClass(2)}`}></div>
            <div className={`w-3 h-3 rounded-sm border ${getColorClass(3)}`}></div>
            <div className={`w-3 h-3 rounded-sm border ${getColorClass(4)}`}></div>
          </div>
          <span>Stronger</span>
        </div>
      </div>

      {/* Tooltip via Portal */}
      {mounted && createPortal(
        <AnimatePresence>
          {hoveredDay && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed z-[9999] -translate-x-1/2 -translate-y-full pointer-events-none bg-neutral-800 border border-neutral-600 rounded-lg p-2 shadow-xl whitespace-nowrap"
              style={{ left: hoveredDay.x, top: hoveredDay.y }}
            >
              <div className="text-xs text-neutral-400 font-medium mb-1">
                {new Date(hoveredDay.day.date).toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-sm font-bold text-neutral-50">
                Rate: <span className="text-lime-500">{hoveredDay.day.rate.toLocaleString(undefined, { minimumFractionDigits: 4 })}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
