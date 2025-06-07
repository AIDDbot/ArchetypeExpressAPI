import type { Response } from "express";
import { BaseError } from "../errors/base.error.ts";
import { logError, logInfo } from "../utils/logger.utils.ts";

export function sendError(
  res: Response,
  error: unknown = 500,
  message: string = "Unknown error"
) {
  let status = 500;
  let errorMessage = message;
  let errorCode = "INTERNAL_ERROR";
  let details: Record<string, any> | undefined;

  if (error instanceof BaseError) {
    status = error.statusCode;
    errorMessage = error.message;
    errorCode = error.errorCode;
    details = error.details;
  } else if (error instanceof Error) {
    errorMessage = error.message;
    // Map common error messages to appropriate status codes
    if (errorMessage.includes("not found")) {
      status = 404;
      errorCode = "NOT_FOUND";
    } else if (errorMessage.includes("Insufficient")) {
      status = 400;
      errorCode = "VALIDATION_ERROR";
    }
  } else if (typeof error === "number") {
    status = error;
  } else if (typeof error === "object" && error !== null) {
    errorMessage = JSON.stringify(error);
  }

  logError(
    `${res.req.method} ${res.req.originalUrl} ${status}`,
    res.req.url,
    errorMessage
  );

  res.status(status).json({
    code: errorCode,
    message: errorMessage,
    ...(details && { details }),
    timestamp: new Date().toISOString(),
  });
}

export function sendSuccess(
  res: Response,
  status: number = 200,
  data: any = {}
) {
  logInfo(`${res.req.method} ${res.req.originalUrl} ${status}`, "ok");
  res.status(status).json(data);
}
