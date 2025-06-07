import type { NextFunction, Request, Response } from "express";
import { getIpFrom, getSourceFrom } from "../shared/request/request.utils.ts";

/**
 * Middleware to log the request and response
 * Usign shares/utils/logger functions to log the request and response
 */
export const logMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = `${req.method} ${req.url}`;
  const ip = getIpFrom(req);
  const source = getSourceFrom(req);
  //logInfo(message, ip, source);
  console.log(message);
  next();
};
