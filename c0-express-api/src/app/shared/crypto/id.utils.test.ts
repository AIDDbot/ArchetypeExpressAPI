import assert from "node:assert";
import { test } from "node:test";
import { file } from "../file/file.adapter.ts";
import { idUtils } from "./id.utils.ts";

// 1 Deterministic tests

test("idUtils.extractSeed", () => {
  const id = "1.2";
  const expectedSeed = 1;
  const actualSeed = idUtils.extractSeed(id);
  assert.strictEqual(actualSeed, expectedSeed);
});

// 2 Non-deterministic tests

test("idUtils.generate", async () => {
  const id = await idUtils.generate();
  const expectedMinLength = 3;
  assert.ok(id.length >= expectedMinLength);
});

// 3 State change tests

test("idUtils.last", async () => {
  const id = await idUtils.generate();
  const expectedLast = Number.parseInt(id.split(".")[1]);
  const actualLast = idUtils.last;
  assert.strictEqual(actualLast, expectedLast);
});

// 4 Effect tests

test("idUtils.seedJson", async () => {
  const id = await idUtils.generate();
  const expectedSeed = Number.parseInt(id.split(".")[0]);
  const actualSeed = await file.readJson("seed.json");
  assert.strictEqual(actualSeed, expectedSeed);
});
