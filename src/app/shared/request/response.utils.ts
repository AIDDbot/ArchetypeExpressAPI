import type { Response } from "express";
import { logError, logInfo } from "../utils/logger.utils.ts";

export function sendError(
  res: Response,
  error: Error | number = 500,
  message: string = "Unknown error"
) {
  let status = 500;
  let errorMessage = message;

  if (error instanceof Error) {
    errorMessage = error.message;
    // Map common error messages to appropriate status codes
    if (errorMessage.includes("not found")) {
      status = 404;
    } else if (errorMessage.includes("Insufficient")) {
      status = 400;
    }
  } else if (typeof error === "number") {
    status = error;
  }

  logError(
    `${res.req.method} ${res.req.originalUrl} ${status}`,
    res.req.url,
    errorMessage
  );
  res.status(status).json({ message: errorMessage });
}

export function sendSuccess(
  res: Response,
  status: number = 200,
  data: any = {}
) {
  logInfo(`${res.req.method} ${res.req.originalUrl} ${status}`, "ok");
  res.status(status).json(data);
}
