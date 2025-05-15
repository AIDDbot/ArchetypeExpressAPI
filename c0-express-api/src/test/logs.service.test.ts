import assert from "node:assert";
import { test } from "node:test";
import type { LogEntryDTO } from "../app/resources/logs/log-entry-dto.type.ts";
import { logsService } from "../app/resources/logs/logs.service.ts";

// Non-deterministic tests

test("logsService.create", async () => {
  // Arrange
  const input: LogEntryDTO = {
    timestamp: 12345678,
    level: "info",
    message: "sample message",
    context: "sample context",
  };
  // Act
  const actual = await logsService.create(input);
  // Assert
  // has an id
  assert.ok(actual.id);
});
