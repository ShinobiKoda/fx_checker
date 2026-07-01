import { useEffect } from "react";

const CHART_RANGES = ["1D", "1W", "1M", "3M", "1Y", "5Y"];

interface KeyboardActions {
  onSwap: () => void;
  onFocusInput: () => void;
  onClear: () => void;
  onToggleReverse: () => void;
  onToggleShortcuts: () => void;
  onSetChartRange?: (range: string) => void;
}

export function useKeyboardShortcuts({
  onSwap,
  onFocusInput,
  onClear,
  onToggleReverse,
  onToggleShortcuts,
  onSetChartRange,
}: KeyboardActions) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't fire shortcuts when user is typing in an input, select, or textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        // Allow Escape to blur out of inputs
        if (e.key === "Escape") {
          (e.target as HTMLElement).blur();
        }
        return;
      }

      // Chart range shortcuts: keys 1-6
      if (onSetChartRange && e.key >= "1" && e.key <= "6") {
        e.preventDefault();
        onSetChartRange(CHART_RANGES[parseInt(e.key) - 1]);
        return;
      }

      switch (e.key.toLowerCase()) {
        case "s":
          e.preventDefault();
          onSwap();
          break;
        case "/":
          e.preventDefault();
          onFocusInput();
          break;
        case "x":
          e.preventDefault();
          onClear();
          break;
        case "r":
          e.preventDefault();
          onToggleReverse();
          break;
        case "?":
          e.preventDefault();
          onToggleShortcuts();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onSwap, onFocusInput, onClear, onToggleReverse, onToggleShortcuts, onSetChartRange]);
}
