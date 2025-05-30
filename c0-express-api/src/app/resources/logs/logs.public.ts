import { idUtils } from "../../shared/crypto/id.utils";
import type { LogEntryDTO } from "./log-entry.dto";
import { LogEntry } from "./log-entry.type";
import { logsFileRepository } from "./logs.file.repository";
import { logsService } from "./logs.service";

export async function createLogEntry(logEntry: LogEntryDTO): Promise<LogEntry> {
  return await logsService.create(logEntry, logsFileRepository, idUtils)
}
