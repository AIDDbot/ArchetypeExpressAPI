import { file } from "../../shared/file/file.adapter.ts";
import { mapLogEntryToCsv } from "./log-entry-csv.mapper.ts";
import type { LogEntry } from "./log-entry.type.ts";

export const logsRepository = {
  buffer: [] as LogEntry[],
  save: async (logEntry: LogEntry) => {
    logsRepository.buffer.push(logEntry);
    await logsRepository.persist();
  },
  persist: async () => {
    if (logsRepository.buffer.length < 0) {
      return;
    }
    const filename = "logs.csv";
    for (const logEntry of logsRepository.buffer) {
      file.appendLine(filename, mapLogEntryToCsv(logEntry));
    }
    logsRepository.buffer = [];
  },
};
