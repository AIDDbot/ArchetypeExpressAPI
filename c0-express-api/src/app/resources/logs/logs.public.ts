import { idUtils } from "../../shared/crypto/id.utils.ts";
import type { LogEntryDTO } from "./log-entry.dto.ts";
import type { LogEntry } from "./log-entry.type.ts";
import { logsFileRepository } from "./logs.file.repository.ts";
import { logsService } from "./logs.service.ts";

export async function createLogEntry(logEntry: LogEntryDTO): Promise<LogEntry> {
  return await logsService.create(logEntry, logsFileRepository, idUtils)
}
