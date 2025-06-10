export type StockIndustry =
  | "Technology"
  | "Automotive"
  | "Retail"
  | "Telecom"
  | "Entertainment"
  | "Food"
  | "Biotechnology";

export type Stock = {
  id: string;
  name: string;
  industry: StockIndustry;
  symbol: string;
};
