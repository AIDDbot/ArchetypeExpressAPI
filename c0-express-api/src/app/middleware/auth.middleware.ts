import type { NextFunction, Request, Response } from "express";
import { getUserIdFrom } from "../shared/request/request.utils.ts";

/**
 * Middleware to authenticate the request
 * Using the token from the request header
 */
export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = getUserIdFrom(req);
  if (!userId) {
    //sendError(res, new AuthenticationError("Unauthorized"));
    next();
    return;
  }
  req.app.set("userId", userId);
  next();
};
