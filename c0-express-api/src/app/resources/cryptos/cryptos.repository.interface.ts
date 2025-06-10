import type { CryptoRate } from "./crypto-rate.type.ts";
import type { CryptoSearchDto } from "./crypto-search.dto.ts";
import type { Crypto } from "./crypto.type.ts";

export interface CryptoRepository {
  findAll(): Promise<Crypto[]>;
  findBySymbol(symbol: string): Promise<Crypto | undefined>;
  search(criteria: CryptoSearchDto): Promise<Crypto[]>;
  getCurrentRate(symbol: string): Promise<CryptoRate>;
}
