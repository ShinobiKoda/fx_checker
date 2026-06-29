import { useState, useEffect } from "react";

export function useRecentCurrencies() {
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("fx_recent_currencies");
      if (stored) {
        setRecents(JSON.parse(stored));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const addRecent = (currencyCode: string) => {
    setRecents((prev) => {
      // Remove it if it already exists to avoid duplicates
      const filtered = prev.filter((c) => c !== currencyCode);
      // Add to front
      const newRecents = [currencyCode, ...filtered].slice(0, 5); // Keep max 5
      
      try {
        localStorage.setItem("fx_recent_currencies", JSON.stringify(newRecents));
      } catch (e) {
        console.error(e);
      }
      
      return newRecents;
    });
  };

  return { recents, addRecent };
}
