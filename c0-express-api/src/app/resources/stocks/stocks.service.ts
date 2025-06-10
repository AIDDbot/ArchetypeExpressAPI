import {
  NotFoundError,
  ValidationError,
} from "../../shared/errors/base.error.ts";
import type { StockPrice } from "./stock-price.type.ts";
import type { StockSearchDto } from "./stock-search.dto.ts";
import type { Stock } from "./stock.type.ts";
import type { StockRepository } from "./stocks.repository.interface.ts";

type Dependencies = {
  stockRepository: StockRepository;
};

export const stocksService = {
  getAllStocks: async (deps: Dependencies): Promise<Stock[]> => {
    return deps.stockRepository.findAll();
  },

  getStockBySymbol: async (
    symbol: string,
    deps: Dependencies
  ): Promise<Stock> => {
    if (!symbol || typeof symbol !== "string") {
      throw new ValidationError("Invalid symbol format", { symbol });
    }

    const stock = await deps.stockRepository.findBySymbol(symbol);
    if (!stock) {
      throw new NotFoundError(`Stock not found with symbol ${symbol}`, {
        symbol,
      });
    }

    return stock;
  },

  searchStocks: async (
    criteria: StockSearchDto,
    deps: Dependencies
  ): Promise<Stock[]> => {
    if (criteria.symbol && typeof criteria.symbol !== "string") {
      throw new ValidationError("Invalid symbol format", {
        symbol: criteria.symbol,
      });
    }

    if (criteria.name && typeof criteria.name !== "string") {
      throw new ValidationError("Invalid name format", { name: criteria.name });
    }

    return deps.stockRepository.search(criteria);
  },

  getCurrentPrice: async (
    symbol: string,
    deps: Dependencies
  ): Promise<StockPrice> => {
    if (!symbol || typeof symbol !== "string") {
      throw new ValidationError("Invalid symbol format", { symbol });
    }

    try {
      return await deps.stockRepository.getCurrentPrice(symbol);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw new NotFoundError(`Stock not found with symbol ${symbol}`, {
          symbol,
        });
      }
      throw error;
    }
  },
};
