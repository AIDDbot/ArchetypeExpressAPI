import {
  NotFoundError,
  ValidationError,
} from "../../shared/errors/base.error.ts";
import type { CryptoRate } from "./crypto-rate.type.ts";
import type { CryptoSearchDto } from "./crypto-search.dto.ts";
import type { Crypto } from "./crypto.type.ts";
import type { CryptoRepository } from "./cryptos.repository.interface.ts";

type Dependencies = {
  cryptoRepository: CryptoRepository;
};

export const cryptosService = {
  getAllCryptos: async (deps: Dependencies): Promise<Crypto[]> => {
    return deps.cryptoRepository.findAll();
  },

  getCryptoBySymbol: async (
    symbol: string,
    deps: Dependencies
  ): Promise<Crypto> => {
    if (!symbol || typeof symbol !== "string") {
      throw new ValidationError("Invalid symbol format", { symbol });
    }

    const crypto = await deps.cryptoRepository.findBySymbol(symbol);
    if (!crypto) {
      throw new NotFoundError(`Crypto not found with symbol ${symbol}`, {
        symbol,
      });
    }

    return crypto;
  },

  searchCryptos: async (
    criteria: CryptoSearchDto,
    deps: Dependencies
  ): Promise<Crypto[]> => {
    if (criteria.symbol && typeof criteria.symbol !== "string") {
      throw new ValidationError("Invalid symbol format", {
        symbol: criteria.symbol,
      });
    }

    if (criteria.name && typeof criteria.name !== "string") {
      throw new ValidationError("Invalid name format", { name: criteria.name });
    }

    if (criteria.kind && !["coin", "token", "stable"].includes(criteria.kind)) {
      throw new ValidationError("Invalid crypto kind", { kind: criteria.kind });
    }

    return deps.cryptoRepository.search(criteria);
  },

  getCurrentRate: async (
    symbol: string,
    deps: Dependencies
  ): Promise<CryptoRate> => {
    if (!symbol || typeof symbol !== "string") {
      throw new ValidationError("Invalid symbol format", { symbol });
    }

    try {
      return await deps.cryptoRepository.getCurrentRate(symbol);
    } catch (error) {
      if (error instanceof Error && error.message.includes("not found")) {
        throw new NotFoundError(`Crypto not found with symbol ${symbol}`, {
          symbol,
        });
      }
      throw error;
    }
  },
};
