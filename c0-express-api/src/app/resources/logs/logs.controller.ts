import { Router } from "express";
import type { LogEntryDTO } from "./log-entry-dto.type.ts";
import { logsService } from "./logs.service.ts";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello Logs!");
});

router.post("/", async (req, res) => {
  const logEntry = req.body as LogEntryDTO;
  const createdLogEntry = await logsService.create(logEntry);
  res.status(201).json(createdLogEntry);
});

export { router as logsController };
