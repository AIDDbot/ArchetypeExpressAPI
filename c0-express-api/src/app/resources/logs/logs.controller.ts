import { Router } from "express";
import type { LogEntryDTO } from "./log-entry-dto.type.ts";
import { logsService } from "./logs.service.ts";

const router = Router();

router.get("/", (req, res) => {
  // method not allowed
  res.status(405).json({ message: "Method not allowed" });
});

router.post("/", async (req, res) => {
  const logEntry = req.body as LogEntryDTO;
  const createdLogEntry = await logsService.create(logEntry);
  res.status(201).json(createdLogEntry);
});

export { router as logsController };
