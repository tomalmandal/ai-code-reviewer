# ⚡ AI Code Reviewer

> An AI-powered code review application that analyzes code for bugs, security vulnerabilities, performance issues, and code quality — then provides actionable feedback, a quality score, and an AI-generated improved version with a side-by-side diff.

Built as an end-to-end AI application with a focus on **streaming, caching, API protection, and production-oriented architecture**.

---

## 🚀 Overview

AI Code Reviewer allows developers to paste code, select a programming language, and receive an AI-generated review in real time.

Instead of simply making a request to an LLM and displaying the response, the application handles several practical concerns involved in building an AI-powered product:

* Real-time streaming of LLM responses
* Structured review output
* Redis caching to avoid repeated AI API calls
* Rate limiting to protect expensive AI endpoints
* Code quality scoring
* Security and performance analysis
* AI-generated code improvements
* Side-by-side diff visualization

The goal was to explore the gap between **calling an AI API** and **building a usable AI feature**.

---

## ✨ Features

### 🐛 AI Code Analysis

Analyzes submitted code for:

* Potential bugs
* Security vulnerabilities
* Performance bottlenecks
* Code quality issues
* Maintainability concerns

Each issue includes structured information such as severity, affected line, explanation, and suggested improvements.

### 🎯 Code Quality Score

Generates a code quality score from **0–100** and displays it using an animated visual gauge.

### 🔐 Security Review

Detects common security concerns such as:

* SQL injection risks
* Hardcoded secrets
* Exposed credentials
* Unsafe input handling

### 📈 Performance Analysis

Identifies potential bottlenecks and provides suggestions for improving performance.

### ✍️ AI-Generated Rewrite

The AI generates an improved version of the submitted code with identified issues addressed.

### 👀 Side-by-Side Diff

Compare:

```text
Original Code  ←→  AI Improved Code
```

to clearly understand what changed.

### ⚡ Real-Time Streaming

LLM responses are streamed from the backend to the frontend using **Server-Sent Events (SSE)**, allowing the UI to receive results progressively instead of waiting for the complete AI response.

### 🗄️ Redis Caching

Repeated reviews of the same code and language use a SHA-256-based cache key.

```text
Request
   ↓
Generate cache key
   ↓
Redis
 ┌───────────────┐
 │ Cache Hit     │ → Return cached review
 │ Cache Miss    │ → Call LLM
 └───────────────┘
```

This reduces:

* LLM API calls
* Response latency
* API cost

Cached results currently use a **1-hour TTL**.

### 🛡️ Rate Limiting

The review endpoint is protected with IP-based rate limiting:

**10 review requests per 15 minutes**

This helps prevent abuse of the AI API and uncontrolled API costs.

### 💻 Multi-Language Support

Currently supports:

* JavaScript
* TypeScript
* Python
* Go
* Java
* Rust
* C++

---

# 🏗️ Architecture

```text
                    ┌───────────────┐
                    │     User      │
                    └───────┬───────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   React + TypeScript    │
              │     Monaco Editor       │
              └───────────┬─────────────┘
                          │
                POST /api/review
                   code + language
                          │
                          ▼
              ┌─────────────────────────┐
              │    Node.js / Express    │
              └───────────┬─────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │ Redis Cache │
                   └──────┬──────┘
                     HIT  │  MISS
              ┌───────────┘    └──────────────┐
              ▼                                ▼
     Return Cached Result               ┌──────────────┐
                                        │   Groq API   │
                                        │ LLaMA 3.3 70B│
                                        └──────┬───────┘
                                               │
                                       Streaming response
                                               │
                                               ▼
                                      Server-Sent Events
                                               │
                                               ▼
                                    React accumulates
                                     structured output
                                               │
                     ┌─────────────────────────┼────────────────────┐
                     ▼                         ▼                    ▼
                Quality Score                Issues              Diff View
```

---

# 🔄 Request Flow

### 1. User submits code

The user writes or pastes code into the Monaco Editor and selects the programming language.

```text
Code + Language
       ↓
POST /api/review
```

### 2. Backend checks Redis

A SHA-256 hash is generated from the request.

```text
SHA-256(code + language)
          ↓
       Redis
```

If the same review already exists in the cache, the cached result is returned.

### 3. Cache miss triggers AI review

If no cached result exists, the backend sends the code to the LLM through the Groq API.

The model analyzes the code and generates structured review data.

### 4. Results are streamed

The backend streams the LLM response to the frontend using SSE.

```text
LLM
 ↓
Express Backend
 ↓
SSE Stream
 ↓
React
```

### 5. Frontend renders the review

The frontend processes the completed response and displays:

* Quality score
* Detected issues
* Severity levels
* Recommendations
* Improved code
* Side-by-side diff

### 6. Result is cached

After the review is completed, the result is stored in Redis for future identical requests.

---

# 🧱 Tech Stack

| Layer                      | Technology                   |
| -------------------------- | ---------------------------- |
| Frontend                   | React 18, TypeScript, Vite   |
| Code Editor                | Monaco Editor                |
| Backend                    | Node.js, Express, TypeScript |
| AI Model                   | LLaMA 3.3 70B                |
| AI Provider                | Groq                         |
| Streaming                  | Server-Sent Events (SSE)     |
| Cache                      | Redis, ioredis               |
| Deployment                 | Vercel + Railway             |
| Container / Local Services | Docker                       |
| Security                   | Rate Limiting                |

---

# 📁 Project Structure

```text
ai-code-reviewer/
│
├── backend/
│   └── src/
│       ├── lib/
│       │   └── redis.ts
│       │
│       ├── middleware/
│       │   └── rateLimit.ts
│       │
│       ├── routes/
│       │   └── review.ts
│       │
│       ├── services/
│       │   ├── reviewer.ts
│       │   └── cache.ts
│       │
│       └── index.ts
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── CodeEditor.tsx
│       │   ├── ReviewPanel.tsx
│       │   ├── ScoreGauge.tsx
│       │   ├── IssueCard.tsx
│       │   ├── SeverityBadge.tsx
│       │   └── DiffViewer.tsx
│       │
│       ├── hooks/
│       │   └── useReview.ts
│       │
│       └── App.tsx
│
├── .env.example
└── README.md
```

---

# 🧩 Key Components

## `CodeEditor.tsx`

Provides the code editing experience using Monaco Editor.

Responsibilities:

* Code input
* Language selection
* Editor state management

---

## `ReviewPanel.tsx`

Responsible for rendering the AI review results.

Displays:

* Code quality score
* Detected issues
* Recommendations
* Improved code

---

## `ScoreGauge.tsx`

Displays the AI-generated code quality score using an SVG-based circular gauge.

---

## `IssueCard.tsx`

Renders individual issues returned by the AI.

Each issue can contain:

* Severity
* Line number
* Description
* Suggested fix

---

## `SeverityBadge.tsx`

Provides a visual severity indicator:

```text
CRITICAL
WARNING
INFO
```

---

## `DiffViewer.tsx`

Displays the original code and AI-generated rewrite side by side.

This allows developers to quickly understand the changes suggested by the AI.

---

## `useReview.ts`

Handles the client-side review workflow:

```text
User clicks Review
        ↓
Send request to backend
        ↓
Receive streamed SSE chunks
        ↓
Accumulate AI response
        ↓
Parse structured result
        ↓
Update React state
        ↓
Render review
```

---

# 🔌 API

## `POST /api/review`

Sends code to the backend for AI analysis.

### Request

```json
{
  "code": "const query = 'SELECT * FROM users WHERE id = ' + id;",
  "language": "javascript"
}
```

### Response Flow

The response is streamed back to the frontend using Server-Sent Events.

The final structured output contains information such as:

```json
{
  "score": 72,
  "issues": [
    {
      "severity": "critical",
      "line": 1,
      "message": "Potential SQL injection vulnerability",
      "suggestion": "Use parameterized queries"
    }
  ],
  "rewrite": "..."
}
```

---

# ⚙️ Run Locally

## Prerequisites

* Node.js 18+
* Docker
* Groq API key

## 1. Clone the repository

```bash
git clone https://github.com/tomalmandal/ai-code-reviewer.git
cd ai-code-reviewer
```

## 2. Install dependencies

### Backend

```bash
cd backend
npm install
```

### Frontend

```bash
cd ../frontend
npm install
```

## 3. Configure environment variables

### Backend

Create:

```text
backend/.env
```

```env
GROQ_API_KEY=your_groq_api_key
REDIS_URL=redis://localhost:6379
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend

Create:

```text
frontend/.env
```

```env
VITE_API_URL=http://localhost:3000
```

---

## 4. Start Redis

```bash
docker run -d -p 6379:6379 redis:alpine
```

---

## 5. Start the backend

```bash
cd backend
npm run dev
```

The backend runs on:

```text
http://localhost:3000
```

---

## 6. Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

# 🚢 Deployment

The application is designed with separate frontend and backend deployments.

```text
Frontend → Vercel
Backend  → Railway
Redis    → Railway Redis
```

The frontend communicates with the backend through:

```env
VITE_API_URL=https://your-backend-domain
```

The backend restricts allowed frontend access using:

```env
FRONTEND_URL=https://your-frontend-domain
```

---

# 🎯 Engineering Decisions

### Why SSE instead of WebSockets?

The application primarily needs one-way streaming:

```text
Server → Client
```

The LLM generates a response and streams it back to the frontend.

SSE is simpler for this use case than maintaining a full bidirectional WebSocket connection.

---

### Why Redis?

AI API calls can be expensive and slower than traditional APIs.

Redis helps reduce unnecessary repeated calls by caching identical reviews.

---

### Why SHA-256 for cache keys?

The submitted code may be large and unsuitable as a raw Redis key.

Hashing creates a consistent and compact key:

```text
code + language
      ↓
   SHA-256
      ↓
  Redis Key
```

---

### Why rate limiting?

Without rate limiting, an AI endpoint could be abused, resulting in:

* Increased API costs
* Resource exhaustion
* Unnecessary load

The application therefore limits requests per IP.

---

# 🧠 What I Learned

Building this project helped me explore practical challenges involved in AI application development:

* Streaming LLM responses to the frontend
* Handling partial streamed responses
* Designing prompts for structured output
* Integrating LLM APIs into a full-stack application
* Redis caching strategies for AI workloads
* Protecting expensive AI endpoints
* Designing responsive AI-powered user interfaces

Most importantly, it helped me understand the difference between:

> **Calling an AI API**

and

> **Building an AI feature that can actually be used in a product.**

---

# 🔮 Future Improvements

Some areas I would extend next:

* User authentication and saved review history
* Repository and GitHub integration
* Pull request review workflow
* Persistent database for review history
* Background job processing for large reviews
* More robust structured output validation
* AI model fallback and retry strategies
* Usage analytics and observability
* Team collaboration and shared reviews
* Automated CI/CD code review integration

---

# 👨‍💻 Author

**Tomal Kanti Mandal**

Full Stack Engineer transitioning into AI Engineering.

* GitHub: https://github.com/tomalmandal
* LinkedIn: https://www.linkedin.com/in/dev-tomal/
* Portfolio: https://hi-tkm.vercel.app

---

# 📄 License

MIT License
