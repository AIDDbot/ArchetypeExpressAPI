import assert from "node:assert";
import { test } from "node:test";
import { mapLogEntryToCsv } from "./log-entry-csv.mapper.ts";
import type { LogEntry } from "./log-entry.type.ts";

// 1. Deterministic tests

test("mapLogEntryToCsv", () => {
  // Arrange
  const input: LogEntry = {
    id: "1",
    timestamp: 12345678,
    level: "info",
    message: "sample message",
    context: "sample context",
    source: "sample source",  
    ip: "sample ip",
  };
  // Act
  const actual = mapLogEntryToCsv(input);
  // Assert
  const expected = `04:25:45,info,"sample message",sample source,sample ip`;
  assert.strictEqual(actual, expected);
});
