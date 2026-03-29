import { redis } from "../lib/redis.js";

/**
 * Cache-aside pattern: returns cached value if present, otherwise calls
 * fetcher, stores the result, and returns it.
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await redis.set(key, fresh, { ex: ttlSeconds });
  return fresh;
}

/** Invalidate a single key. */
export async function invalidate(key: string): Promise<void> {
  await redis.del(key);
}

/** Invalidate all keys matching a prefix (scan-based, use sparingly). */
export async function invalidatePrefix(prefix: string): Promise<void> {
  const keys = await redis.keys(`${prefix}*`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}
