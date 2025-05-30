import type { LogEntry } from "./log-entry.type.ts";

export type LogEntryDTO = Omit<LogEntry, "id">;
