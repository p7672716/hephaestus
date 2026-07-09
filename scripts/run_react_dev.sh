#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PYTHON="${PYTHON:-$ROOT/.venv/bin/python}"
if [ ! -x "$PYTHON" ]; then
  PYTHON="python3"
fi

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required (Node.js 22.12 or newer)." >&2
  exit 1
fi

cd "$ROOT/frontend"
if [ ! -d node_modules ]; then
  npm install
fi

cd "$ROOT"
"$PYTHON" -m uvicorn hephaestus_server.app:app --host 127.0.0.1 --port 8787 &
BACKEND_PID=$!
FRONTEND_PID=""
cleanup() {
  code=$?
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null || true
  kill "$BACKEND_PID" 2>/dev/null || true
  wait "$BACKEND_PID" 2>/dev/null || true
  [ -n "$FRONTEND_PID" ] && wait "$FRONTEND_PID" 2>/dev/null || true
  exit "$code"
}
trap cleanup EXIT INT TERM

cd "$ROOT/frontend"
npm run dev &
FRONTEND_PID=$!
wait "$FRONTEND_PID"
