/**
 * Simple in-memory rate limiter — use Redis in production for multi-instance.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number;  // time window in ms
  max: number;        // max requests per window
}

export function rateLimit(key: string, config: RateLimitConfig): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true, remaining: config.max - 1, resetIn: config.windowMs };
  }

  if (entry.count >= config.max) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count++;
  return { allowed: true, remaining: config.max - entry.count, resetIn: entry.resetAt - now };
}

export function getRateLimitKey(ip: string, path: string): string {
  return `${ip}:${path}`;
}

// Config presets
export const RATE_LIMITS = {
  auth: { windowMs: 60 * 1000, max: 10 } as RateLimitConfig,       // 10/min
  adminLogin: { windowMs: 60 * 1000, max: 5 } as RateLimitConfig,  // 5/min
  createDocument: { windowMs: 60 * 1000, max: 20 } as RateLimitConfig, // 20/min
  shareLink: { windowMs: 60 * 1000, max: 10 } as RateLimitConfig,   // 10/min
  export: { windowMs: 60 * 1000, max: 5 } as RateLimitConfig,       // 5/min
  review: { windowMs: 60 * 1000, max: 10 } as RateLimitConfig,      // 10/min
};
