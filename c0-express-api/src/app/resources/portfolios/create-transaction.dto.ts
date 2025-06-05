import type { AssetType } from "./asset.type.ts";
import type { TransactionType } from "./transaction.type.ts";

export type CreateTransactionDto = {
  type: TransactionType;
  asset_type: AssetType;
  symbol: string;
  units: number;
  price_per_unit: number;
};
