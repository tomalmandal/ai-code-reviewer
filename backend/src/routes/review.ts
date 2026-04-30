import { Router, Request, Response } from "express";
import { streamReview } from "../services/reviewer";
import { getCached, setCached } from "../services/cache";
import crypto from "crypto";

const router = Router();

router.post("/review", async (req: Request, res: Response) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "code and language are required" });
  }

  if (code.length > 10000) {
    return res
      .status(400)
      .json({ error: "Code too long. Max 10,000 characters." });
  }

  const cacheKey = `review:${crypto.createHash("sha256").update(`${language}:${code}`).digest("hex")}`;

  const cached = await getCached(cacheKey);
  if (cached) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Cache", "HIT");
    res.flushHeaders();
    res.write(`data: ${JSON.stringify({ chunk: cached })}\n\n`);
    res.write("data: [DONE]\n\n");
    return res.end();
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Cache", "MISS");
  res.flushHeaders();

  try {
    await streamReview(
      code,
      language,
      (chunk) => {
        res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
      },
      async (full) => {
        await setCached(cacheKey, full, 3600);
        res.write("data: [DONE]\n\n");
        res.end();
      },
    );
  } catch (err) {
    res.write(`data: ${JSON.stringify({ error: "Review failed" })}\n\n`);
    res.end();
  }
});

export default router;
