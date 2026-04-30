#!/bin/bash
set -e

echo "==> Setting up AI Code Reviewer"

echo "==> Installing backend dependencies..."
cd backend && npm install && cd ..

echo "==> Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "==> Creating env files..."
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "⚠  Edit backend/.env and add your ANTHROPIC_API_KEY"
fi

if [ ! -f frontend/.env ]; then
  echo "VITE_API_URL=http://localhost:3000" > frontend/.env
fi

echo ""
echo "✅ Setup complete."
echo ""
echo "Next steps:"
echo "  1. Edit backend/.env — add ANTHROPIC_API_KEY"
echo "  2. docker run -d -p 6379:6379 redis:alpine"
echo "  3. cd backend && npm run dev"
echo "  4. cd frontend && npm run dev  (new terminal)"
