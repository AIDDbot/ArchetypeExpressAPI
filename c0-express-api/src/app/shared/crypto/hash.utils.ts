import { createHash } from "node:crypto";
import type { HashUtils } from "./hash.utils.interface.ts";

export const hashUtils: HashUtils = {
  hashString: (str: string) => {
    return createHash("sha256").update(str).digest("hex");
  },
};
