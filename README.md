# ⚡ AI Code Reviewer

> Paste your code. Get a full AI-powered review in seconds — bugs, security vulnerabilities, performance issues, quality score, and a complete rewrite with a live diff view.

**🔗 Live Demo:** [ai-code-reviewer-blue-zeta.vercel.app](https://ai-code-reviewer-blue-zeta.vercel.app)

> Note: First request may take 20-30s (free tier cold start). Once warm, reviews complete in 2-3 seconds. For full speed, run locally.

---

## Features

- 🐛 **Bug Detection** — Line-level precision with critical / warning / info severity
- 🔐 **Security Audit** — SQL injection, hardcoded secrets, exposed credentials
- 📈 **Performance Analysis** — Bottleneck detection with actionable fix suggestions
- 🎯 **Quality Score** — Animated 0-100 gauge (green / amber / red)
- ✍️ **AI Rewrite** — Complete rewritten version with all issues fixed
- 👀 **Diff View** — Side-by-side comparison of original vs AI rewrite
- ⚡ **Real-time Streaming** — Results stream token by token via SSE
- 🗄️ **Redis Caching** — Identical code returns instantly, zero API cost on repeats
- 🛡️ **Rate Limiting** — IP-based protection (10 reviews / 15 min)
- 7 Languages — JavaScript, TypeScript, Python, Go, Java, Rust, C++

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Editor | Monaco Editor (VS Code engine) |
| Backend | Node.js, Express, TypeScript |
| AI | Groq API, LLaMA 3.3 70B |
| Streaming | Server-Sent Events (SSE) |
| Cache | Redis (ioredis) |
| Deploy | Vercel (frontend) + Railway (backend + Redis) |

---

## Architecture

```
Browser (React + Monaco)
    |
    | POST /api/review (code + language)
    v
Express Backend
    |
    |-- Redis cache check (SHA-256 key)
    |     |-- HIT  → stream cached result instantly
    |     |-- MISS → call Groq API
    |
    |-- Groq LLaMA 3.3 70B (streaming)
    |     |-- SSE chunks → client in real time
    |     |-- onDone → cache result in Redis (1hr TTL)
    |
    v
React parses accumulated JSON → renders score, bugs, diff
```

---

## Run Locally

### Prerequisites
- Node.js 18+
- Docker (for Redis)

### Setup

```bash
# 1. Clone
git clone https://github.com/your-username/ai-code-reviewer.git
cd ai-code-reviewer

# 2. Install dependencies
cd backend && npm install
cd ../frontend && npm install

# 3. Set environment variables
cp backend/.env.example backend/.env
# Edit backend/.env and add your GROQ_API_KEY

echo "VITE_API_URL=http://localhost:3000" > frontend/.env

# 4. Start Redis
docker run -d -p 6379:6379 redis:alpine

# 5. Start backend (Terminal 1)
cd backend && npm run dev

# 6. Start frontend (Terminal 2)
cd frontend && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

### Get a free Groq API key
1. Go to [console.groq.com](https://console.groq.com)
2. Sign up (no credit card required)
3. Create an API key
4. Add it to `backend/.env` as `GROQ_API_KEY`

---

## Environment Variables

### `backend/.env`
```env
GROQ_API_KEY=your-groq-api-key
REDIS_URL=redis://localhost:6379
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### `frontend/.env`
```env
VITE_API_URL=http://localhost:3000
```

---

## Deploy

### Backend → Railway

```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
```

Add these in Railway dashboard → Variables:
```
GROQ_API_KEY=your-key
FRONTEND_URL=https://your-app.vercel.app
```

Add Redis: Railway dashboard → New → Database → Redis

### Frontend → Vercel

```bash
npm install -g vercel
cd frontend
vercel
vercel env add VITE_API_URL   # paste Railway URL
vercel --prod
```

---

## Project Structure

```
ai-code-reviewer/
├── backend/
│   └── src/
│       ├── lib/
│       │   └── redis.ts          # Redis singleton
│       ├── services/
│       │   ├── reviewer.ts       # Groq streaming + prompt
│       │   └── cache.ts          # Redis get/set
│       ├── middleware/
│       │   └── rateLimit.ts      # IP-based rate limiting
│       ├── routes/
│       │   └── review.ts         # SSE streaming route
│       └── index.ts              # Express app
└── frontend/
    └── src/
        ├── components/
        │   ├── CodeEditor.tsx     # Monaco editor
        │   ├── ReviewPanel.tsx    # Results renderer
        │   ├── ScoreGauge.tsx     # SVG circular gauge
        │   ├── DiffViewer.tsx     # Side-by-side diff
        │   ├── IssueCard.tsx      # Collapsible issue cards
        │   └── SeverityBadge.tsx  # Critical/warning/info badge
        ├── hooks/
        │   └── useReview.ts       # SSE streaming hook
        └── App.tsx
```

---

## What I Learned Building This

- Streaming LLM responses over SSE and handling partial chunks correctly
- Prompt engineering for reliable structured JSON output from LLMs
- Building production-grade caching for AI API calls with Redis
- Rate limiting strategies for AI endpoints
- The gap between "calling an AI API" and "shipping a production AI feature"

---

## Author

**Tomal** — Full Stack Engineer
- LinkedIn: https://www.linkedin.com/in/dev-tomal/
- GitHub: https://github.com/tomalmandal/

---

## License

MIT
