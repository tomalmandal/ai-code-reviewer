import { Request, Response, NextFunction } from "express";
import { redis } from "../lib/redis";

const WINDOW_SECONDS = 15 * 60;
const MAX_REQUESTS = 10;

export async function reviewRateLimit(req: Request, res: Response, next: NextFunction): Promise<void> {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const key = `ratelimit:${ip}`;

  try {
    const current = await redis.incr(key);

    if (current === 1) {
      await redis.expire(key, WINDOW_SECONDS);
    }

    const ttl = await redis.ttl(key);

    res.setHeader("X-RateLimit-Limit", MAX_REQUESTS);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, MAX_REQUESTS - current));
    res.setHeader("X-RateLimit-Reset", ttl);

    if (current > MAX_REQUESTS) {
      res.status(429).json({
        error: "Too many reviews. Try again in 15 minutes.",
        retryAfter: ttl,
      });
      return;
    }

    next();
  } catch {
    next();
  }
}
