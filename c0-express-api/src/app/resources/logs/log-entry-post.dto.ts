import type { LogEntry } from "./log-entry.type.ts";

export type LogEntryPostDTO = Omit<LogEntry, "id">;
