import type { Response } from "express";

export function sendError(res: Response, status: number = 500, message: string = "Unknown error") {
  res.status(status).json({ message });
}

export function sendSuccess(res: Response, status: number = 200, data: any = {}) {
  res.status(status).json(data);
}

