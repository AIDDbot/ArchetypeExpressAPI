import type { Request, Response } from "express";
import { Router } from "express";
import type { LogEntryDTO } from "./log-entry-dto.type.ts";
import { logsService } from "./logs.service.ts";

const router = Router();

router.get("/", (req, res) => {
  // method not allowed
  res.status(405).json({ message: "Method not allowed" });
});

router.post("/", async (req: Request, res: Response) => {
  const logEntry = req.body as LogEntryDTO;
  fillSourceAndIp(logEntry, req);
  const createdLogEntry = await logsService.create(logEntry);
  res.status(201).json(createdLogEntry);
});

function fillSourceAndIp(logEntry: LogEntryDTO, req: Request) {
  logEntry.source =
    logEntry.source || (req.headers["user-agent"] as string) || "";
  logEntry.ip =
    logEntry.ip ||
    (Array.isArray(req.headers["x-forwarded-for"])
      ? (req.headers["x-forwarded-for"][0] as string)
      : (req.headers["x-forwarded-for"] as string)) ||
    "unknown";
}

export { router as logsController };
