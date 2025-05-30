import type { Request } from "express";

export function getIpFromRequest(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"] as string;
  if (!forwardedFor) {
    return "unknown";
  }
  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0];
  }
  return forwardedFor;
}

export function getSourceFromRequest(req: Request): string {
  const source = req.headers["user-agent"] as string;
  if (!source) {
    return "unknown";
  }
  return source;
}
