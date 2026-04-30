# AI Code Reviewer

> Paste code. Get a full review with bug detection, performance analysis, security audit, quality score, and an AI-suggested rewrite — with a live diff view.

## Live Demo

🔗 [your-app.vercel.app](https://your-app.vercel.app)

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Monaco Editor
- **Backend:** Node.js, Express, TypeScript
- **AI:** Groq API (llama-3.3-70b-versatile) with SSE streaming
- **Cache:** Redis (review caching + rate limiting)
- **Deploy:** Vercel + Railway

## Features

- Real-time streaming review (SSE)
- Side-by-side diff view (original vs AI rewrite)
- Quality score with circular gauge (0–100)
- Bug, performance, and security analysis
- Redis caching (identical code = instant result)
- IP-based rate limiting (10 reviews / 15 min)

## Run Locally

```bash
# 1. Clone
git clone https://github.com/your-username/ai-code-reviewer.git
cd ai-code-reviewer

# 2. Install deps
cd backend && npm install
cd ../frontend && npm install

# 3. Set env vars
cp .env.example backend/.env   # add your GROQ_API_KEY
echo "VITE_API_URL=http://localhost:3000" > frontend/.env

# 4. Start Redis
docker run -d -p 6379:6379 redis:alpine

# 5. Start backend (Terminal 1)
cd backend && npm run dev

# 6. Start frontend (Terminal 2)
cd frontend && npm run dev
```

## Deploy

### Backend → Railway

```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway add --plugin redis
railway up
# Add ANTHROPIC_API_KEY and FRONTEND_URL in Railway dashboard
```

### Frontend → Vercel

```bash
npm install -g vercel
cd frontend
vercel
vercel env add VITE_API_URL   # paste Railway URL
vercel --prod
```
