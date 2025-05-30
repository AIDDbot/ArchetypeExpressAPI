export const encodeUtils = {
  /**
   * Base64Url encodes a string or Buffer.
   * JWTs use Base64Url encoding, which is slightly different from standard Base64.
   * @param {string | Buffer} input - The string or Buffer to encode.
   * @returns {string} The Base64Url encoded string.
   */
  base64UrlEncode(input: string | Buffer): string {
    let base64 = Buffer.from(input).toString("base64");
    // Replace Base64 specific characters with Base64Url specific characters
    base64 = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    return base64;
  },
  /**
   * Base64Url decodes a string.
   * @param {string} input - The Base64Url encoded string.
   * @returns {string} The decoded string.
   */
  base64UrlDecode(input: string): string {
    // Add back padding if it was removed
    input = input.replace(/-/g, "+").replace(/_/g, "/");
    while (input.length % 4) {
      input += "=";
    }
    return Buffer.from(input, "base64").toString();
  },
};
