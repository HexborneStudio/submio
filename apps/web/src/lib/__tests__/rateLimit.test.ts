import { describe, it, expect } from "vitest";
import { rateLimit, RATE_LIMITS } from "../../middleware/rateLimit";

describe("rateLimit", () => {
  it("allows requests within limit", () => {
    const result = rateLimit("test-ip:/api/test", RATE_LIMITS.auth);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBeGreaterThan(0);
  });

  it("blocks after limit exceeded", () => {
    const limit = { windowMs: 1000, max: 3 };
    // Use unique key for this test
    const key = `test-block-${Date.now()}:/api/test`;
    for (let i = 0; i < 3; i++) {
      rateLimit(key, limit);
    }
    const result = rateLimit(key, limit);
    expect(result.allowed).toBe(false);
  });

  it("resets after window expires", async () => {
    const limit = { windowMs: 100, max: 2 };
    const key = `test-reset-${Date.now()}:/api/test`;
    rateLimit(key, limit);
    rateLimit(key, limit);
    const blocked = rateLimit(key, limit);
    expect(blocked.allowed).toBe(false);

    // Wait for window to expire
    await new Promise((r) => setTimeout(r, 150));
    const reset = rateLimit(key, limit);
    expect(reset.allowed).toBe(true);
  });
});
