import { Asset } from "./asset.type";

export type Portfolio = {
  id: string;
  user_id: string;
  name: string;
  initial_cash: number;
  cash: number;
  lastUpdated: Date;
  assets: Asset[];
};
