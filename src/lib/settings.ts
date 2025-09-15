const CURRENCY_KEY = "currency";

export const getCurrency = (): string => {
  if (typeof window === "undefined") return "$"; // default on server
  return localStorage.getItem(CURRENCY_KEY) || "$";
};
