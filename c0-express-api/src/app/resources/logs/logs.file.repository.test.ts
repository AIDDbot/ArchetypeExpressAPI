import assert from "node:assert";
import { beforeEach, describe, it } from "node:test";
import { file } from "../../shared/file/file.adapter.ts";
import type { LogEntry } from "./log-entry.type.ts";
import { logsFileRepository } from "./logs.file.repository.ts";


describe("logsFileRepository.save", () => {
  const filename = "/temp/logs.csv";
  beforeEach(async () => {
    await file.delete(filename);
  });
  it("should save the log entry to the file", async () => {
    // Arrange
  const logEntry: LogEntry = {
    id: "1",
    timestamp: 12345678,
    level: "info",
    message: "sample message",
    context: "sample context",
    source: "sample source",
    ip: "sample ip",
  };
  // Act
  await logsFileRepository.save(logEntry);
  // Assert
  const fileContent = await file.read(filename);
  const logLines = fileContent.split("\n");
  assert.match(logLines[0], /sample message/);
  });
});