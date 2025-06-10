import type { CryptoRate } from "./crypto-rate.type.ts";
import type { CryptoSearchDto } from "./crypto-search.dto.ts";
import type { Crypto } from "./crypto.type.ts";
import { cryptosInMemoryRepository } from "./cryptos.in-memory.repository.ts";
import { cryptosService } from "./cryptos.service.ts";

export async function getAllCryptos(): Promise<Crypto[]> {
  const deps = {
    cryptoRepository: cryptosInMemoryRepository,
  };
  return cryptosService.getAllCryptos(deps);
}

export async function getCryptoBySymbol(symbol: string): Promise<Crypto> {
  const deps = {
    cryptoRepository: cryptosInMemoryRepository,
  };
  return cryptosService.getCryptoBySymbol(symbol, deps);
}

export async function searchCryptos(
  criteria: CryptoSearchDto
): Promise<Crypto[]> {
  const deps = {
    cryptoRepository: cryptosInMemoryRepository,
  };
  return cryptosService.searchCryptos(criteria, deps);
}

export async function getCurrentRate(symbol: string): Promise<CryptoRate> {
  const deps = {
    cryptoRepository: cryptosInMemoryRepository,
  };
  return cryptosService.getCurrentRate(symbol, deps);
}
