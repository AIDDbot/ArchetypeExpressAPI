import { idUtils } from "../../shared/crypto/id.utils.ts";
import type { LogEntryDTO } from "./log-entry.dto.ts";
import type { LogEntry } from "./log-entry.type.ts";
import { logsFileRepository } from "./logs.file.repository.ts";
import { logsService } from "./logs.service.ts";

const deps = {
  logRepository: logsFileRepository,
  idUtils: idUtils,
};

export async function createLogEntry(logEntry: LogEntryDTO): Promise<LogEntry> {
  return await logsService.create(logEntry, deps);
}
