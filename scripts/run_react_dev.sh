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
trap 'kill "$BACKEND_PID" 2>/dev/null || true' EXIT INT TERM

cd "$ROOT/frontend"
exec npm run dev
