import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reviewRouter from "./routes/review";
import { reviewRateLimit } from "./middleware/rateLimit";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api", reviewRateLimit, reviewRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
