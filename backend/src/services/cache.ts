import { redis } from "../lib/redis";

export async function getCached(key: string): Promise<string | null> {
  try {
    return await redis.get(key);
  } catch {
    return null;
  }
}

export async function setCached(key: string, value: string, ttlSeconds: number): Promise<void> {
  try {
    await redis.setex(key, ttlSeconds, value);
  } catch {
    // fail silently
  }
}
