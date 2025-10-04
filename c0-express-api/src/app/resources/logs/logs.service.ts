import type { IdUtils } from "../../shared/crypto/id.utils.interface.ts";
import type { LogEntryDTO } from "./log-entry.dto.ts";
import type { LogEntry } from "./log-entry.type.ts";
import type { LogsRepository } from "./logs.repository.interface.ts";

export const logsService = {
  create: async (
    logEntryDto: LogEntryDTO,
    deps: {
      logRepository: LogsRepository;
      idUtils: IdUtils;
    }
  ): Promise<LogEntry> => {
    const logEntry: LogEntry = {
      ...logEntryDto,
      id: await deps.idUtils.generate(),
    };
    await deps.logRepository.save(logEntry);
    // write also to the console
    console.log(`[${logEntry.level}] ${logEntry.message}`); 
    return logEntry;
  },
};
