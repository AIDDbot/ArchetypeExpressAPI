import type { StockPrice } from "./stock-price.type";
import type { StockSearchDto } from "./stock-search.dto";
import type { Stock } from "./stock.type";
import type { StockRepository } from "./stocks.repository.interface";

const stocks: Stock[] = [
  {
    id: "5b2c7b5f-9b2b-4b8e-8f3a-0c5d2b1a4c7e",
    name: "Apple Inc.",
    industry: "Technology",
    symbol: "AAPL",
  },
  {
    id: "8f3a0c5d-2b1a-4c7e-5b2c-7b5f9b2b4b8e",
    name: "Microsoft Corporation",
    industry: "Technology",
    symbol: "MSFT",
  },
  {
    id: "7b5f9b2b-4b8e-8f3a-0c5d-2b1a4c7e5b2c",
    name: "Amazon.com, Inc.",
    industry: "Technology",
    symbol: "AMZN",
  },
  {
    id: "0c5d2b1a-4c7e-5b2c-7b5f-9b2b4b8e8f3a",
    name: "NVIDIA Corporation",
    industry: "Technology",
    symbol: "NVDA",
  },
  {
    id: "4b8e8f3a-0c5d-2b1a-4c7e-5b2c7b5f9b2b",
    name: "Alphabet Inc. (Class A)",
    industry: "Technology",
    symbol: "GOOGL",
  },
  {
    id: "9b2b4b8e-8f3a-0c5d-2b1a-4c7e5b2c7b5f",
    name: "Tesla, Inc.",
    industry: "Automotive",
    symbol: "TSLA",
  },
  {
    id: "4c7e5b2c-7b5f-9b2b-4b8e-8f3a0c5d2b1a",
    name: "Meta Platforms, Inc.",
    industry: "Technology",
    symbol: "META",
  },
  {
    id: "8e8f3a0c-5d2b-1a4c-7e5b-2c7b5f9b2b4b",
    name: "Broadcom Inc.",
    industry: "Technology",
    symbol: "AVGO",
  },
  {
    id: "1a4c7e5b-2c7b-5f9b-2b4b-8e8f3a0c5d2b",
    name: "Costco Wholesale Corporation",
    industry: "Retail",
    symbol: "COST",
  },
  {
    id: "a1b2c3d4-e5f6-7890-1234-567890abcdef",
    name: "Adobe Inc.",
    industry: "Technology",
    symbol: "ADBE",
  },
];

export const stocksInMemoryRepository: StockRepository = {
  findAll: async (): Promise<Stock[]> => {
    return [...stocks];
  },

  findBySymbol: async (symbol: string): Promise<Stock | undefined> => {
    return stocks.find(
      (stock) => stock.symbol.toUpperCase() === symbol.toUpperCase()
    );
  },

  search: async (criteria: StockSearchDto): Promise<Stock[]> => {
    return stocks.filter((stock) => {
      if (
        criteria.name &&
        !stock.name.toLowerCase().includes(criteria.name.toLowerCase())
      ) {
        return false;
      }
      if (criteria.industry && stock.industry !== criteria.industry) {
        return false;
      }
      if (
        criteria.symbol &&
        !stock.symbol.toUpperCase().includes(criteria.symbol.toUpperCase())
      ) {
        return false;
      }
      return true;
    });
  },

  getCurrentPrice: async (symbol: string): Promise<StockPrice> => {
    const stock = await stocksInMemoryRepository.findBySymbol(symbol);
    if (!stock) {
      throw new Error(`Stock not found with symbol ${symbol}`);
    }

    // Generate a random price between 11 and 999
    const price = Math.floor(Math.random() * 989) + 11;

    return {
      symbol: stock.symbol,
      price,
      date: Date.now(),
    };
  },
};
