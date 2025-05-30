import { file } from "../file/file.adapter.ts";
import type { Id } from "./id.interface.ts";

let last = 0;
let seed = 0;

export const idUtils: Id & any = {
  extractSeed: (id: string) => {
    return parseInt(id.split(".")[0]);
  },
  extractLast: (id: string) => {
    return parseInt(id.split(".")[1]);
  },
  getSeed: async () => {
    if (seed > 0) return seed;
    if (await file.exists("seed.json")) {
      seed = await file.readJson("seed.json");
      seed++;
    }
    await file.writeJson("seed.json", seed);
    return seed;
  },
  generate: async () => {
    const currentSeed = await idUtils.getSeed();
    last++;
    return `${currentSeed}.${last}`;
  },
  get last() {
    return last;
  },
  get seed() {
    return seed;
  },
};
