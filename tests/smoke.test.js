import { describe, it, expect } from 'vitest';

// Proves the test harness runs. Real tests arrive with the logic in src/.
describe('test harness', () => {
  it('runs a passing test', () => {
    expect(1 + 1).toBe(2);
  });
});
