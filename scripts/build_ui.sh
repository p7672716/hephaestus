#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT/frontend"

if ! command -v npm >/dev/null 2>&1; then
  echo "npm is required (Node.js 22.12 or newer)." >&2
  exit 1
fi

npm install
npm run build

echo "React UI built at frontend/dist. FastAPI will serve it automatically."
