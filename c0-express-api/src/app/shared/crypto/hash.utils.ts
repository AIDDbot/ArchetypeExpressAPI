import { createHash } from "node:crypto";
import { HashUtils } from "./hash-utils.interface";

export const hashUtils: HashUtils = {
  hashString: (str: string) => {
    return createHash("sha256").update(str).digest("hex");
  },
};
