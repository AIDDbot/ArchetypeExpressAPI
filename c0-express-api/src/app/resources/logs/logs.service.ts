import type { Id } from "../../shared/crypto/id.interface.ts";
import type { LogEntryDTO } from "./log-entry-dto.type.ts";
import type { LogEntry } from "./log-entry.type.ts";
import type { LogsRepository } from "./logs.repository.interface.ts";


export const logsService = {
  create: async (logEntryDto: LogEntryDTO, logRepository: LogsRepository, id: Id): Promise<LogEntry> => {
    const logEntry : LogEntry = {
      ...logEntryDto,
        id: await id.generate(),
    };
    await logRepository.save(logEntry);
    return logEntry;
  },
};
