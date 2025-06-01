import assert from "node:assert";
import { describe, it } from "node:test";
import type { IdUtils } from "../../shared/crypto/id.utils.interface.ts";
import type { LogEntryDTO } from "./log-entry.dto.ts";
import type { LogEntry } from "./log-entry.type.ts";
import type { LogsRepository } from "./logs.repository.interface.ts";
import { logsService } from "./logs.service.ts";

describe("logsService.create", () => {
  it("should create a log entry", async () => {
    // Arrange
    const logEntryDto: LogEntryDTO = {
      message: "sample message",
      level: "info",
      context: "sample context",
      timestamp: 12345678,
      source: "sample source",
      ip: "sample ip",
    };
    const logRepository: LogsRepository = {
      save: async (logEntry: LogEntry) => {
        console.log(logEntry);
      },
    };
    const idUtils: IdUtils = {
      generate: async () => {
        return "1";
      },
    };
    // Act
    const logEntry = await logsService.create(logEntryDto, {
      logRepository,
      idUtils,
    });
    // Assert
    assert.strictEqual(logEntry.message, "sample message");
  });
});
