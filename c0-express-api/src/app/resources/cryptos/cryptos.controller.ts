// --- Express ---
import type { Request, Response } from "express";
import { Router } from "express";

// --- Application ---
import {
  getAllCryptos,
  getCryptoBySymbol,
  getCurrentRate,
  searchCryptos,
} from "./cryptos.application.ts";

// --- Shared ---
import type { ErrorResDTO } from "../../shared/request/error.res.dto.ts";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";

// --- Types ---
import type { CryptoRate } from "./crypto-rate.type.ts";
import type { CryptoSearchDto } from "./crypto-search.dto.ts";
import type { Crypto } from "./crypto.type.ts";

export const cryptosController = Router();

cryptosController.get(
  "/",
  async (req: Request, res: Response<Crypto[] | ErrorResDTO>) => {
    try {
      const cryptos = await getAllCryptos();
      sendSuccess(res, 200, cryptos);
    } catch (error) {
      sendError(res, error);
    }
  }
);

cryptosController.get(
  "/search",
  async (req: Request, res: Response<Crypto[] | ErrorResDTO>) => {
    try {
      const criteria: CryptoSearchDto = {
        name: req.query.name as string,
        kind: req.query.kind as any,
        symbol: req.query.symbol as string,
      };
      const cryptos = await searchCryptos(criteria);
      sendSuccess(res, 200, cryptos);
    } catch (error) {
      sendError(res, error);
    }
  }
);

cryptosController.get(
  "/:symbol",
  async (req: Request, res: Response<Crypto | ErrorResDTO>) => {
    try {
      const { symbol } = req.params;
      const crypto = await getCryptoBySymbol(symbol);
      sendSuccess(res, 200, crypto);
    } catch (error) {
      sendError(res, error);
    }
  }
);

cryptosController.get(
  "/:symbol/rate",
  async (req: Request, res: Response<CryptoRate | ErrorResDTO>) => {
    try {
      const { symbol } = req.params;
      const rate = await getCurrentRate(symbol);
      sendSuccess(res, 200, rate);
    } catch (error) {
      sendError(res, error);
    }
  }
);
