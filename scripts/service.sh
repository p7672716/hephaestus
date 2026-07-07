#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="$ROOT/.hephaestus"
PID_FILE="$STATE_DIR/hephaestus.pid"
LOG_FILE="$STATE_DIR/hephaestus.log"
OLLAMA_PID_FILE="$STATE_DIR/ollama.pid"
OLLAMA_LOG_FILE="$STATE_DIR/ollama.log"
BIND_HOST="${HOST:-0.0.0.0}"
CONTROL_HOST="${CONTROL_HOST:-127.0.0.1}"
PORT="${PORT:-8787}"
PYTHON="${PYTHON:-$ROOT/.venv/bin/python}"

if [ ! -x "$PYTHON" ]; then
  PYTHON="python3"
fi

mkdir -p "$STATE_DIR"

app_pid() {
  if [ -s "$PID_FILE" ]; then
    local pid
    pid="$(cat "$PID_FILE")"
    if kill -0 "$pid" 2>/dev/null; then
      printf '%s\n' "$pid"
      return 0
    fi
  fi
  pgrep -f "[u]vicorn hephaestus_server.app:app.*--port ${PORT}" | head -n 1 || true
}

wait_health() {
  local deadline=$((SECONDS + 60))
  until curl -fsS "http://${CONTROL_HOST}:${PORT}/api/health" >/dev/null 2>&1; do
    if [ "$SECONDS" -ge "$deadline" ]; then
      echo "Hephaestus did not become ready. See $LOG_FILE" >&2
      return 1
    fi
    sleep 1
  done
}

ensure_ollama() {
  command -v ollama >/dev/null 2>&1 || return 0
  if curl -fsS "http://127.0.0.1:11434/api/version" >/dev/null 2>&1; then
    return 0
  fi
  if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files ollama.service >/dev/null 2>&1; then
    sudo systemctl start ollama || true
  fi
  for _ in $(seq 1 10); do
    curl -fsS "http://127.0.0.1:11434/api/version" >/dev/null 2>&1 && return 0
    sleep 1
  done
  if curl -fsS "http://127.0.0.1:11434/api/version" >/dev/null 2>&1; then
    return 0
  fi
  setsid ollama serve >"$OLLAMA_LOG_FILE" 2>&1 < /dev/null &
  echo "$!" > "$OLLAMA_PID_FILE"
}

start() {
  local pid
  pid="$(app_pid)"
  if [ -n "$pid" ]; then
    echo "$pid" > "$PID_FILE"
    echo "Hephaestus already running: http://${CONTROL_HOST}:${PORT} (pid $pid)"
    return 0
  fi
  ensure_ollama
  cd "$ROOT"
  setsid "$PYTHON" -m uvicorn hephaestus_server.app:app --host "$BIND_HOST" --port "$PORT" >"$LOG_FILE" 2>&1 < /dev/null &
  pid="$!"
  echo "$pid" > "$PID_FILE"
  wait_health
  echo "Hephaestus started: http://${CONTROL_HOST}:${PORT} (pid $pid, bind ${BIND_HOST})"
}

stop() {
  curl -fsS -X POST "http://${CONTROL_HOST}:${PORT}/api/runtime/stop" >/dev/null 2>&1 || true
  local pid
  pid="$(app_pid)"
  if [ -n "$pid" ]; then
    kill "$pid" 2>/dev/null || true
    for _ in $(seq 1 20); do
      kill -0 "$pid" 2>/dev/null || break
      sleep 0.25
    done
    kill -9 "$pid" 2>/dev/null || true
    echo "Hephaestus stopped (pid $pid)"
  else
    echo "Hephaestus is not running"
  fi
  rm -f "$PID_FILE"
  if [ -s "$OLLAMA_PID_FILE" ]; then
    local ollama_pid
    ollama_pid="$(cat "$OLLAMA_PID_FILE")"
    kill "$ollama_pid" 2>/dev/null || true
    rm -f "$OLLAMA_PID_FILE"
  fi
}

status() {
  local pid
  pid="$(app_pid)"
  if [ -n "$pid" ]; then
    echo "Hephaestus running: http://${CONTROL_HOST}:${PORT} (pid $pid, bind ${BIND_HOST})"
    curl -fsS "http://${CONTROL_HOST}:${PORT}/api/runtime/status" 2>/dev/null || true
    echo
  else
    echo "Hephaestus is not running"
  fi
}

case "${1:-}" in
  start) start ;;
  stop) stop ;;
  restart) stop; start ;;
  status) status ;;
  logs) tail -n "${2:-80}" -f "$LOG_FILE" ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs}" >&2
    exit 2
    ;;
esac
