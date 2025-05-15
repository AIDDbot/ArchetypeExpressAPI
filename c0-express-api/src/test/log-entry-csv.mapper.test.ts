import assert from "node:assert";
import { test } from "node:test";
import { mapLogEntryToCsv } from "../app/resources/logs/log-entry-csv.mapper.ts";
import type { LogEntry } from "../app/resources/logs/log-entry.type.ts";

// Deterministic tests

test("mapLogEntryToCsv", () => {
  // Arrange
  const input: LogEntry = {
    id: "1",
    timestamp: 12345678,
    level: "info",
    message: "sample message",
    context: "sample context",
  };
  // Act
  const actual = mapLogEntryToCsv(input);
  // Assert
  const expected = `12345678,info,sample message`;
  assert.strictEqual(actual, expected);
});
