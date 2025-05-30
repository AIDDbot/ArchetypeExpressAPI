import type { Request, Response } from "express";
import { Router } from "express";
import { idUtils } from "../../shared/crypto/id.utils.ts";
import type { LogEntryDTO } from "./log-entry-dto.type.ts";
import { logsFileRepository } from "./logs.file.repository.ts";
import { logsService } from "./logs.service.ts";

const router = Router();

router.get("/", (req, res) => {
  // method not allowed
  res.status(405).json({ message: "Method not allowed" });
});

router.post("/", async (req: Request, res: Response) => {
  const logEntry = req.body as LogEntryDTO;
  fillSourceAndIp(logEntry, req);
  const createdLogEntry = await logsService.create(logEntry, logsFileRepository, idUtils);
  res.status(201).json(createdLogEntry);
});

function fillSourceAndIp(logEntry: LogEntryDTO, req: Request) {
  logEntry.source =
    logEntry.source || req.headers["user-agent"]  || "unknown";
  logEntry.ip = logEntry.ip || getIpFromRequest(req);
}

function getIpFromRequest(req: Request): string {
  const forwardedFor = req.headers["x-forwarded-for"] as string;
  if (!forwardedFor) {
    return "unknown";
  }
  if (Array.isArray(forwardedFor)) {
    return forwardedFor[0];
  }
  return forwardedFor;
}
export { router as logsController };

