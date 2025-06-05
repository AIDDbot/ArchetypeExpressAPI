import type { IdUtils } from "../../shared/crypto/id.utils.interface.ts";
import { ValidationError } from "../../shared/errors/base.error.ts";
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
    if (!logEntryDto || Object.keys(logEntryDto).length === 0) {
      throw new ValidationError("Log entry data is required");
    }

    const validationErrors: string[] = [];
    if (!logEntryDto.message) validationErrors.push("message is required");
    if (!logEntryDto.level) validationErrors.push("level is required");
    if (!logEntryDto.context) logEntryDto.context = "unknown";

    if (validationErrors.length > 0) {
      throw new ValidationError("Invalid log entry data", {
        errors: validationErrors,
        received: {
          hasMessage: !!logEntryDto.message,
          hasLevel: !!logEntryDto.level,
          hasContext: !!logEntryDto.context,
          hasSource: !!logEntryDto.source,
          hasIp: !!logEntryDto.ip,
        },
      });
    }

    const logEntry: LogEntry = {
      ...logEntryDto,
      id: await deps.idUtils.generate(),
      timestamp: logEntryDto.timestamp || Date.now(),
    };

    await deps.logRepository.save(logEntry);
    return logEntry;
  },
};
