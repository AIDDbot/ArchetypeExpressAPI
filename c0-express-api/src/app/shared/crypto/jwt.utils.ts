import crypto from "node:crypto";
import { encodeUtils } from "./encode.utils.ts";
// --- Configuration ---
const JWT_SECRET = "your-super-secret-key-that-is-at-least-32-characters-long"; // Replace with a strong, unique secret
const ALGORITHM = "HS256"; // HMAC using SHA-256
const EXPIRES_IN_SECONDS = 3600; // 1 hour

/**
 * Creates a HMAC SHA256 signature.
 * @param {string} data - The data to sign.
 * @param {string} secret - The secret key.
 * @returns {Buffer} The signature.
 */
function createSignature(data: string, secret: string) {
  if (ALGORITHM !== "HS256") {
    throw new Error(
      "Unsupported algorithm. Only HS256 is implemented in this example."
    );
  }
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(data);
  return hmac.digest();
}

/**
 * Creates a JWT.
 * @param {object} payload - The payload data to include in the token.
 * @returns {string} The generated JWT.
 */
function createJwt(
  payload: any,
  secret: string,
  expiresInSeconds: number
): string {
  // 1. Header
  const header = {
    alg: ALGORITHM,
    typ: "JWT",
  };
  const encodedHeader = encodeUtils.base64UrlEncode(JSON.stringify(header));

  // 2. Payload
  const jwtPayload = { ...payload };
  jwtPayload.iat = Math.floor(Date.now() / 1000); // Issued at timestamp (seconds)
  jwtPayload.exp = jwtPayload.iat + expiresInSeconds; // Expiration timestamp (seconds)
  const encodedPayload = encodeUtils.base64UrlEncode(
    JSON.stringify(jwtPayload)
  );

  // 3. Signature
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = createSignature(signingInput, secret);
  const encodedSignature = encodeUtils.base64UrlEncode(signature);

  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifies a JWT.
 * @param {string} token - The JWT to verify.
 * @param {string} secret - The secret key used to sign the token.
 * @returns {object | undefined} The decoded payload if the token is valid and not expired, otherwise undefined.
 */
function verifyJwt(token: string, secret: string): object | undefined {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid token format: Token must have 3 parts.");
    }

    const [encodedHeader, encodedPayload, encodedSignature] = parts;

    // 1. Verify Header (optional, but good practice to check alg)
    const header = JSON.parse(encodeUtils.base64UrlDecode(encodedHeader));
    if (header.alg !== ALGORITHM) {
      throw new Error(
        `Invalid algorithm: Expected ${ALGORITHM}, got ${header.alg}`
      );
    }

    // 2. Verify Signature
    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = encodeUtils.base64UrlEncode(
      createSignature(signingInput, secret)
    );

    if (encodedSignature !== expectedSignature) {
      throw new Error("Invalid signature.");
    }

    // 3. Decode Payload and Check Expiration
    const jwtPayloadJson = encodeUtils.base64UrlDecode(encodedPayload);
    const jwtPayload = JSON.parse(jwtPayloadJson);

    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (jwtPayload.exp && jwtPayload.exp < currentTimestamp) {
      throw new Error("Token has expired.");
    }
    console.log("jwtPayload", jwtPayload);
    return jwtPayload;
  } catch (error) {
    console.error("Error verifying token:", error);
    return undefined;
  }
}

export const jwtUtils = {
  sign: (payload: any): string =>
    createJwt(payload, JWT_SECRET, EXPIRES_IN_SECONDS),
  verify: (token: string): any => verifyJwt(token, JWT_SECRET),
};
