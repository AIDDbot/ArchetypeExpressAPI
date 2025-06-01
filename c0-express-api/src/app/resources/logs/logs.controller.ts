// --- Express ---
import type { Request, Response } from "express";
import { Router } from "express";
// --- Application ---
import { createLogEntry } from "./logs.application.ts";
// --- Shared ---
import {
  getIpFrom,
  getSourceFrom,
} from "../../shared/request/request.utils.ts";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";
// --- Types ---
import type { ErrorResDTO } from "../../shared/request/error.res.dto.ts";
import type { IdResDTO } from "../../shared/request/id.res.dto.ts";
import type { LogEntryDTO } from "./log-entry.dto.ts";

export const logsController = Router();
logsController.get("/", logsGetHandler);
logsController.post("/", postHandler);

async function logsGetHandler(req: Request, res: Response<ErrorResDTO>) {
  res.status(405).json({ message: "Method not allowed" });
}
async function postHandler(
  req: Request,
  res: Response<IdResDTO | ErrorResDTO>
) {
  const logEntry: LogEntryDTO = req.body as LogEntryDTO;
  if (!logEntry || Object.keys(logEntry).length === 0) {
    sendError(res, 400, "Log entry is required");
    return;
  }
  logEntry.source = logEntry.source || getSourceFrom(req);
  logEntry.ip = logEntry.ip || getIpFrom(req);
  try {
    const createdLogEntry = await createLogEntry(logEntry);
    const logEntryPostResDTO: IdResDTO = {
      id: createdLogEntry.id,
    };
    sendSuccess(res, 201, logEntryPostResDTO);
  } catch (error) {
    console.error(error);
    sendError(res, 204, "");
  }
}
