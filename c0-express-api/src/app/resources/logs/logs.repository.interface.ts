import type { LogEntry } from "./log-entry.type.ts";

export interface LogsRepository {
  save: (logEntry: LogEntry) => Promise<void>;
}

