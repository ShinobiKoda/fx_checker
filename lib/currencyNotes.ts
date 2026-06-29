export const CURRENCY_NOTES: Record<string, string> = {
  USD: "Primary global reserve currency",
  EUR: "Official currency of 20 EU member states",
  GBP: "Oldest currency in continuous use",
  JPY: "Popular safe-haven fiat currency",
  CHF: "Traditional safe-haven asset",
  CAD: "Major commodity-linked currency",
  AUD: "Commodity currency, heavily linked to gold",
  CNY: "Regulated by the People's Bank of China",
  HKD: "Pegged to the US Dollar",
  NZD: "Often called the 'Kiwi'",
  SGD: "Major financial hub of Southeast Asia",
  INR: "Managed by the Reserve Bank of India",
  ZAR: "Legal tender in the Common Monetary Area",
  BRL: "Largest economy in South America",
  NGN: "Central Bank of Nigeria official rate",
  KES: "East Africa's financial powerhouse",
  GHS: "Central Bank of Ghana official rate",
};

export const getCurrencyNote = (code: string, standardName: string) => {
  return CURRENCY_NOTES[code] || standardName;
};
