import type { Request, Response } from "express";
import { Router } from "express";
import type { ErrorResDTO } from "../../shared/request/error.res.dto.ts";
import type { IdResDTO } from "../../shared/request/id.res.dto.ts";
import { getIpFromRequest, getSourceFromRequest } from "../../shared/request/request.utils.ts";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";
import type { LogEntryDTO } from "./log-entry.dto.ts";
import { createLogEntry } from "./logs.public.ts";

export const logsController = Router();
logsController.get("/", logsGetHandler);
logsController.post("/", postHandler);


async function logsGetHandler(req: Request, res: Response<ErrorResDTO>) {
  res.status(405).json({ message: "Method not allowed" });
}
async function postHandler(req: Request, res: Response<IdResDTO | ErrorResDTO>) {
  const logEntry: LogEntryDTO = req.body as LogEntryDTO;
  if (!logEntry || Object.keys(logEntry).length === 0) {
    sendError(res, 400, "Log entry is required");
    return;
  }
  logEntry.source = logEntry.source || getSourceFromRequest(req);
  logEntry.ip = logEntry.ip || getIpFromRequest(req);
  const createdLogEntry = await createLogEntry(logEntry);
  const logEntryPostResDTO: IdResDTO = {
    id: createdLogEntry.id,
  };
  sendSuccess(res, 201, logEntryPostResDTO);
}


