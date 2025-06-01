import { createLogEntry } from "../../resources/logs/logs.application.ts";

export function logInfo(message: string, source: string, context: string = "") {
  createLogEntry(buildLogEntry("info", message, source, context));
}

export function logError(
  message: string,
  source: string,
  context: string = ""
) {
  createLogEntry(buildLogEntry("error", message, source, context));
}

export function buildLogEntry(
  level: string,
  message: string,
  source: string,
  context: string
) {
  return {
    message,
    source,
    ip: "localhost",
    level,
    context,
    timestamp: new Date().getTime(),
  };
}
