// ToDo: Some kind of session seed increment stored in a file
import { file } from "../file/file.adapter.ts";
let last = 0;
let seed = 0;

export const idUtils = {
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
    const seed = await idUtils.getSeed();
    last++;
    return `${seed}.${last}`;
  },
};
