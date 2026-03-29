import { redis } from "../lib/redis.js";

const PREFIX = "jwt:revoked:";

/**
 * Add a JWT jti to the Redis revocation list.
 * TTL is set to when the token naturally expires so the key self-cleans.
 */
export async function revokeToken(
  jti: string,
  expiresAt: number,
): Promise<void> {
  const ttlSeconds = Math.max(0, expiresAt - Math.floor(Date.now() / 1000));
  if (ttlSeconds > 0) {
    await redis.set(`${PREFIX}${jti}`, "1", { ex: ttlSeconds });
  }
}

/**
 * Returns true if the given jti has been revoked.
 */
export async function isRevoked(jti: string): Promise<boolean> {
  const val = await redis.get(`${PREFIX}${jti}`);
  return val !== null;
}
