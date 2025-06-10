import type { CryptoRate } from "./crypto-rate.type.ts";
import type { CryptoSearchDto } from "./crypto-search.dto.ts";
import type { Crypto } from "./crypto.type.ts";
import type { CryptoRepository } from "./cryptos.repository.interface.ts";

const cryptos: Crypto[] = [
  {
    id: "c1d2e3f4-a5b6-7890-1234-567890abcdef",
    name: "Bitcoin",
    symbol: "BTC",
    kind: "coin",
  },
  {
    id: "d2e3f4a5-b6c7-8901-2345-67890abcdef0",
    name: "Ethereum",
    symbol: "ETH",
    kind: "coin",
  },
  {
    id: "e3f4a5b6-c7d8-9012-3456-7890abcdef01",
    name: "Tether",
    symbol: "USDT",
    kind: "stable",
  },
  {
    id: "f4a5b6c7-d8e9-0123-4567-890abcdef012",
    name: "BNB",
    symbol: "BNB",
    kind: "coin",
  },
  {
    id: "a5b6c7d8-e9f0-1234-5678-90abcdef0123",
    name: "Solana",
    symbol: "SOL",
    kind: "coin",
  },
  {
    id: "b6c7d8e9-f0a1-2345-6789-0abcdef01234",
    name: "USD Coin",
    symbol: "USDC",
    kind: "stable",
  },
  {
    id: "c7d8e9f0-a1b2-3456-7890-bcdef012345a",
    name: "XRP",
    symbol: "XRP",
    kind: "coin",
  },
  {
    id: "d8e9f0a1-b2c3-4567-8901-cdef012345ab",
    name: "Dogecoin",
    symbol: "DOGE",
    kind: "coin",
  },
  {
    id: "e9f0a1b2-c3d4-5678-9012-def012345abc",
    name: "Cardano",
    symbol: "ADA",
    kind: "coin",
  },
  {
    id: "f0a1b2c3-d4e5-6789-0123-ef012345abcd",
    name: "Chainlink",
    symbol: "LINK",
    kind: "token",
  },
];

export const cryptosInMemoryRepository: CryptoRepository = {
  findAll: async (): Promise<Crypto[]> => {
    return [...cryptos];
  },

  findBySymbol: async (symbol: string): Promise<Crypto | undefined> => {
    return cryptos.find(
      (crypto) => crypto.symbol.toUpperCase() === symbol.toUpperCase()
    );
  },

  search: async (criteria: CryptoSearchDto): Promise<Crypto[]> => {
    return cryptos.filter((crypto) => {
      if (
        criteria.name &&
        !crypto.name.toLowerCase().includes(criteria.name.toLowerCase())
      ) {
        return false;
      }
      if (criteria.kind && crypto.kind !== criteria.kind) {
        return false;
      }
      if (
        criteria.symbol &&
        !crypto.symbol.toUpperCase().includes(criteria.symbol.toUpperCase())
      ) {
        return false;
      }
      return true;
    });
  },

  getCurrentRate: async (symbol: string): Promise<CryptoRate> => {
    const crypto = await cryptosInMemoryRepository.findBySymbol(symbol);
    if (!crypto) {
      throw new Error(`Crypto not found with symbol ${symbol}`);
    }

    // Generate a random price between 0.01 and 100000
    const dollar =
      crypto.kind === "stable"
        ? 1 + (Math.random() * 0.02 - 0.01) // Stable coins hover around $1
        : Math.random() * 100000 + 0.01; // Other cryptos have wider range

    return {
      symbol: crypto.symbol,
      dollar: Number(dollar.toFixed(2)),
      date: Date.now(),
    };
  },
};
