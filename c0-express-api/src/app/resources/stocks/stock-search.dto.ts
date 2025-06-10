import type { StockIndustry } from "./stock.type";

export type StockSearchDto = {
  name?: string;
  industry?: StockIndustry;
  symbol?: string;
};
