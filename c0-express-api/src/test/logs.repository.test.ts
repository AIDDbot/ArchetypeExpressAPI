import assert from "node:assert";
import { test } from "node:test";
import { logsRepository } from "../app/resources/logs/logs.repository.ts";
import { idUtils } from "../app/shared/crypto/id.utils.ts";
import { file } from "../app/shared/file/file.adapter.ts";

// State change tests

test("logsRepository.save", () => {
  const logEntry = {
    id: "1",
    timestamp: 12345678,
    level: "info",
    message: "sample message",
    context: "sample context",
  };
  // Act
  logsRepository.save(logEntry);
  // Assert
  assert.strictEqual(logsRepository.buffer.length, 1);
  assert.strictEqual(logsRepository.buffer[0], logEntry);
});

// Effect tests

test("logsRepository.persist", async () => {
  // Arrange
  logsRepository.buffer = [];
  for (let i = 1; i < 10; i++) {
    await logsRepository.save({
      id: await idUtils.generate(),
      timestamp: Date.now(),
      level: "info",
      message: `sample message for ${i}`,
      context: `sample context for ${i}`,
    });
  }
  // Act
  await logsRepository.save({
    id: await idUtils.generate(),
    timestamp: Date.now(),
    level: "warn",
    message: "The last log entry",
    context: "The last log entry context",
  });
  // Assert
  assert.strictEqual(logsRepository.buffer.length, 0);
  // wait for the file to be written
  await new Promise((resolve) => setTimeout(resolve, 100));
  const exists = await file.exists("logs.csv");
  assert.strictEqual(exists, true);
});
