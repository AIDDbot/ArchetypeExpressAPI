import assert from "node:assert";
import { test } from "node:test";
import { idUtils } from "../app/shared/crypto/id.utils.ts";
import { file } from "../app/shared/file/file.adapter.ts";

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

test("idUtils.getSeed", async () => {
  const id = await idUtils.generate();
  const expectedLast = parseInt(id.split(".")[1]);
  const actualLast = idUtils.last;
  assert.strictEqual(actualLast, expectedLast);
});

// 4 Effect tests

test("idUtils.generate", async () => {
  const id = await idUtils.generate();
  const expectedSeed = parseInt(id.split(".")[0]);
  const actualSeed = await file.readJson("seed.json");
  assert.strictEqual(actualSeed, expectedSeed);
});
