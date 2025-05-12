import assert from "node:assert";
import { describe, test } from "node:test";
import { add, subtract } from '../src/shared/maths.ts';

describe('Math functions', () => {
  describe('add', () => {
    test('should add two positive numbers correctly', () => {
       assert.strictEqual(add(2, 3), 5);
    });

    test('should handle negative numbers', () => {
      assert.strictEqual(add(-2, 3), 1);
      assert.strictEqual(add(2, -3), -1);
      assert.strictEqual(add(-2, -3), -5);
    });

    test('should handle zero', () => {
      assert.strictEqual(add(0, 5), 5);
      assert.strictEqual(add(5, 0), 5);
      assert.strictEqual(add(0, 0), 0);
    });
  });

  describe('subtract', () => {
    test('should subtract two positive numbers correctly', () => {
        assert.strictEqual(subtract(5, 3), 2);
    });

    test('should handle negative numbers', () => {
      assert.strictEqual(subtract(-2, 3), -5);
      assert.strictEqual(subtract(2, -3), 5);
      assert.strictEqual(subtract(-2, -3), 1);
    });

    test('should handle zero', () => {
      assert.strictEqual(subtract(5, 0), 5);
      assert.strictEqual(subtract(0, 5), -5);
      assert.strictEqual(subtract(0, 0), 0);
    });
  });
});
