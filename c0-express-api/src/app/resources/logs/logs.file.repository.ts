import { file } from "../../shared/file/file.adapter.ts";
import { mapLogEntryToCsv } from "./log-entry-csv.mapper.ts";
import type { LogEntry } from "./log-entry.type.ts";
import type { LogsRepository } from "./logs.repository.interface.ts";

const filename = "./tmp/logs.csv";

export const logsFileRepository: LogsRepository = {
  save: async (logEntry: LogEntry) => {
    const logLine = mapLogEntryToCsv(logEntry);
    await file.appendLine(filename, logLine);
  },
};


