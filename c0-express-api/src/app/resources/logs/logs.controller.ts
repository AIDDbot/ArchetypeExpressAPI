import type { Request, Response } from "express";
import { Router } from "express";
import { idUtils } from "../../shared/crypto/id.utils.ts";
import type { ErrorResDTO } from "../../shared/request/error.res.dto.ts";
import { getIpFromRequest, getSourceFromRequest } from "../../shared/request/request.utils.ts";
import { sendError, sendSuccess } from "../../shared/request/response.utils.ts";
import type { LogEntryPostDTO } from "./log-entry-post.dto.ts";
import type { LogEntryPostResDTO } from "./log-entry-post.res.dto.ts";
import { logsFileRepository } from "./logs.file.repository.ts";
import { logsService } from "./logs.service.ts";

export const logsController = Router();
logsController.get("/", logsGetHandler);
logsController.post("/", postHandler);


export async function logsGetHandler(req: Request, res: Response<ErrorResDTO>) {
  res.status(405).json({ message: "Method not allowed" });
}
export async function postHandler(req: Request, res: Response<LogEntryPostResDTO | ErrorResDTO>) {
  const logEntry: LogEntryPostDTO = req.body as LogEntryPostDTO;
  if (!logEntry) sendError(res, 400, "Log entry is required");
  logEntry.source = logEntry.source || getSourceFromRequest(req);
  logEntry.ip = logEntry.ip || getIpFromRequest(req);
  const createdLogEntry = await logsService.create(logEntry, logsFileRepository, idUtils);
  const logEntryPostResDTO: LogEntryPostResDTO = {
    id: createdLogEntry.id,
  };
  sendSuccess(res, 201, logEntryPostResDTO);
}


