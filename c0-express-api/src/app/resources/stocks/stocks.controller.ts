// --- Express ---
import type { Request, Response } from "express";
import { Router } from "express";

// --- Application ---
import {
  getAllStocks,
  getCurrentPrice,
  getStockBySymbol,
  searchStocks,
} from "./stocks.application.ts";

// --- Shared ---
import type { ErrorResDTO } from "../../shared/request/error.res.dto.ts";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";

// --- Types ---
import type { StockPrice } from "./stock-price.type.ts";
import type { StockSearchDto } from "./stock-search.dto.ts";
import type { Stock } from "./stock.type.ts";

export const stocksController = Router();

stocksController.get(
  "/",
  async (req: Request, res: Response<Stock[] | ErrorResDTO>) => {
    try {
      const stocks = await getAllStocks();
      sendSuccess(res, 200, stocks);
    } catch (error) {
      sendError(res, error);
    }
  }
);

stocksController.get(
  "/search",
  async (req: Request, res: Response<Stock[] | ErrorResDTO>) => {
    try {
      const criteria: StockSearchDto = {
        name: req.query.name as string,
        industry: req.query.industry as any,
        symbol: req.query.symbol as string,
      };
      const stocks = await searchStocks(criteria);
      sendSuccess(res, 200, stocks);
    } catch (error) {
      sendError(res, error);
    }
  }
);

stocksController.get(
  "/:symbol",
  async (req: Request, res: Response<Stock | ErrorResDTO>) => {
    try {
      const { symbol } = req.params;
      const stock = await getStockBySymbol(symbol);
      sendSuccess(res, 200, stock);
    } catch (error) {
      sendError(res, error);
    }
  }
);

stocksController.get(
  "/:symbol/price",
  async (req: Request, res: Response<StockPrice | ErrorResDTO>) => {
    try {
      const { symbol } = req.params;
      const price = await getCurrentPrice(symbol);
      sendSuccess(res, 200, price);
    } catch (error) {
      sendError(res, error);
    }
  }
);
