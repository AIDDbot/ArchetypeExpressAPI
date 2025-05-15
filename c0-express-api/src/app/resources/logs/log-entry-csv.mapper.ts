import type { LogEntry } from "./log-entry.type.ts";

export function mapLogEntryToCsv(logEntry: LogEntry): string {
  return `${logEntry.timestamp},${logEntry.level},${logEntry.message}`;
}
