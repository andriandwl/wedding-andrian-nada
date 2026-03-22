/**
 * lib/rate-limit.ts
 * Simple in-memory rate limiter.
 * Tracks attempts per IP; resets after windowMs.
 * NOTE: For multi-instance prod, replace with Redis.
 */

interface Entry {
  count:     number;
  resetAt:   number;
}

const store = new Map<string, Entry>();

const MAX_ATTEMPTS = 10;
const WINDOW_MS    = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { ok: boolean; remaining: number } {
  const now  = Date.now();
  let entry  = store.get(ip);

  if (!entry || entry.resetAt < now) {
    entry = { count: 0, resetAt: now + WINDOW_MS };
    store.set(ip, entry);
  }

  entry.count++;

  if (entry.count > MAX_ATTEMPTS) {
    return { ok: false, remaining: 0 };
  }

  return { ok: true, remaining: MAX_ATTEMPTS - entry.count };
}
