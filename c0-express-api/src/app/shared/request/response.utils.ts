import type { Response } from "express";
import { logError, logInfo } from "../utils/logger.utils.ts";

export function sendError(
  res: Response,
  status: number = 500,
  message: string = "Unknown error"
) {
  logError(
    `${res.req.method} ${res.req.originalUrl} ${status}`,
    res.req.url,
    message
  );
  res.status(status).json({ message });
}

export function sendSuccess(
  res: Response,
  status: number = 200,
  data: any = {}
) {
  logInfo(`${res.req.method} ${res.req.originalUrl} ${status}`, "ok");
  console.log(data);
  res.status(status).json(data);
}
