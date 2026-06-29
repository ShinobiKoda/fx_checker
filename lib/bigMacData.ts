// Based on approximated 2024 Big Mac Index data from The Economist
export interface BigMacDataPoint {
  currency: string;
  localPrice: number;
}

export const BIG_MAC_USD_PRICE = 5.69;

export const BIG_MAC_DATA: Record<string, BigMacDataPoint> = {
  EUR: { currency: "EUR", localPrice: 5.39 },
  GBP: { currency: "GBP", localPrice: 4.19 },
  JPY: { currency: "JPY", localPrice: 450.0 },
  CHF: { currency: "CHF", localPrice: 6.70 },
  CAD: { currency: "CAD", localPrice: 6.99 },
  AUD: { currency: "AUD", localPrice: 7.45 },
  CNY: { currency: "CNY", localPrice: 24.50 },
  INR: { currency: "INR", localPrice: 209.0 },
  ZAR: { currency: "ZAR", localPrice: 49.90 },
  BRL: { currency: "BRL", localPrice: 25.90 },
  NGN: { currency: "NGN", localPrice: 3500.0 },
};

/**
 * Calculates the purchasing power parity valuation.
 * @param localPrice The price of a Big Mac in local currency
 * @param currentExchangeRate Current actual exchange rate (e.g. 1 USD = X Local)
 * @returns Object with impliedPPP and valuation (percentage, negative = undervalued)
 */
export const calculateBigMacValuation = (localPrice: number, currentExchangeRate: number) => {
  const impliedPPP = localPrice / BIG_MAC_USD_PRICE;
  const valuation = ((impliedPPP - currentExchangeRate) / currentExchangeRate) * 100;
  return { impliedPPP, valuation };
};
