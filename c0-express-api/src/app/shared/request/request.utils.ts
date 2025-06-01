import type { Request } from "express";
import { jwtUtils } from "../crypto/jwt.utils.ts";

export function getIpFrom(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"] as string;
  if (!forwardedFor) {
    return "127.0.0.1";
  }
  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0];
  }
  return forwardedFor;
}

export function getSourceFrom(req: Request): string {
  const source = req.headers["user-agent"] as string;
  if (!source) {
    return "unknown source";
  }
  return source;
}

export function getUserIdFrom(req: Request): string | undefined {
  const token = getTokenFromRequest(req);
  if (!token) {
    return undefined;
  }
  const decodedToken = jwtUtils.verify(token);
  if (!decodedToken) {
    return undefined;
  }
  return decodedToken.id;
}

function getTokenFromRequest(req: Request): string | undefined {
  const authorization = req.headers["authorization"] as string;
  if (!authorization) {
    return undefined;
  }
  return authorization.split(" ")[1];
}
