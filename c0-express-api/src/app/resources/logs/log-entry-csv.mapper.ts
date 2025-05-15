import { getTimeString } from "../../shared/utils/string.utils.ts";
import type { LogEntry } from "./log-entry.type.ts";

export function mapLogEntryToCsv(logEntry: LogEntry): string {
  const timestamp = getTimeString(new Date(logEntry.timestamp));
  return `${timestamp},${logEntry.level},"${logEntry.message}",${logEntry.source},${logEntry.ip}`;
}
