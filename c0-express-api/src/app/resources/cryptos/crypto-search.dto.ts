import type { CryptoKind } from "./crypto.type.ts";

export type CryptoSearchDto = {
  name?: string;
  kind?: CryptoKind;
  symbol?: string;
};
