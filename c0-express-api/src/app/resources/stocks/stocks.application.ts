import type { StockPrice } from "./stock-price.type.ts";
import type { StockSearchDto } from "./stock-search.dto.ts";
import type { Stock } from "./stock.type.ts";
import { stocksInMemoryRepository } from "./stocks.in-memory.repository.ts";
import { stocksService } from "./stocks.service.ts";

export async function getAllStocks(): Promise<Stock[]> {
  const deps = {
    stockRepository: stocksInMemoryRepository,
  };
  return stocksService.getAllStocks(deps);
}

export async function getStockBySymbol(symbol: string): Promise<Stock> {
  const deps = {
    stockRepository: stocksInMemoryRepository,
  };
  return stocksService.getStockBySymbol(symbol, deps);
}

export async function searchStocks(criteria: StockSearchDto): Promise<Stock[]> {
  const deps = {
    stockRepository: stocksInMemoryRepository,
  };
  return stocksService.searchStocks(criteria, deps);
}

export async function getCurrentPrice(symbol: string): Promise<StockPrice> {
  const deps = {
    stockRepository: stocksInMemoryRepository,
  };
  return stocksService.getCurrentPrice(symbol, deps);
}
