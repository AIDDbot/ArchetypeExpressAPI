import type { IdGenerate } from "../../shared/crypto/id.interface.ts";
import type { LogEntryDTO } from "./log-entry.dto.ts";
import type { LogEntry } from "./log-entry.type.ts";
import type { LogsRepository } from "./logs.repository.interface.ts";

export const logsService = {
  create: async (
    logEntryDto: LogEntryDTO,
    logRepository: LogsRepository,
    idGenerate: IdGenerate
  ): Promise<LogEntry> => {
    const logEntry: LogEntry = {
      ...logEntryDto,
      id: await idGenerate.generate(),
    };
    await logRepository.save(logEntry);
    return logEntry;
  },
};
