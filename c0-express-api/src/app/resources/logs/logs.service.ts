import { idUtils } from "../../shared/crypto/id.utils.ts";
import type { LogEntryDTO } from "./log-entry-dto.type.ts";
import type { LogEntry } from "./log-entry.type.ts";
import { logsRepository } from "./logs.repository.ts";

export const logsService = {
  create: async (logEntryDto: LogEntryDTO): Promise<LogEntry> => {
    const logEntry = {
      ...logEntryDto,
      id: await idUtils.generate(),
    };
    await logsRepository.save(logEntry);
    return logEntry;
  },
};
