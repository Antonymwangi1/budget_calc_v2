const CURRENCY_KEY = "currency";

export const getCurrency = (): string => {
  if (typeof window === "undefined") return "USD"; // default on server
  return localStorage.getItem(CURRENCY_KEY) || "USD";
};
