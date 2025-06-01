import { file } from "../file/file.adapter.ts";
import type { IdUtils } from "./id.utils.interface.ts";

let counter = 0;
let seed = 0;

export const idUtils: IdUtils = {
  generate: async () => {
    const currentSeed = await getSeed();
    counter++;
    return `${currentSeed}.${counter}`;
  },
};

const FILE_NAME = "seed.json";

async function getSeed() {
  if (seed > 0) return seed;
  if (await file.exists(FILE_NAME)) {
    seed = await file.readJson(FILE_NAME);
  }
  seed++;
  await file.writeJson(FILE_NAME, seed);
  return seed;
}
