import type { StockPrice } from "./stock-price.type";
import type { StockSearchDto } from "./stock-search.dto";
import type { Stock } from "./stock.type";

export interface StockRepository {
  findAll(): Promise<Stock[]>;
  findBySymbol(symbol: string): Promise<Stock | undefined>;
  search(criteria: StockSearchDto): Promise<Stock[]>;
  getCurrentPrice(symbol: string): Promise<StockPrice>;
}
