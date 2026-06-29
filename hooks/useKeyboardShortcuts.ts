import { useEffect } from "react";

interface KeyboardActions {
  onSwap: () => void;
  onFocusInput: () => void;
  onClear: () => void;
  onToggleReverse: () => void;
  onToggleShortcuts: () => void;
}

export function useKeyboardShortcuts({
  onSwap,
  onFocusInput,
  onClear,
  onToggleReverse,
  onToggleShortcuts,
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
  }, [onSwap, onFocusInput, onClear, onToggleReverse, onToggleShortcuts]);
}
