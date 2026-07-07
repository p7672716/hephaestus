#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
STATE_DIR="$ROOT/.hephaestus"
PID_FILE="$STATE_DIR/cloudflared.pid"
LOG_FILE="$STATE_DIR/cloudflared.log"
URL_FILE="$STATE_DIR/cloudflare-url.txt"
CLOUDFLARED="${CLOUDFLARED:-$STATE_DIR/bin/cloudflared}"
TARGET_URL="${TARGET_URL:-http://127.0.0.1:8787}"
TUNNEL_NAME="${TUNNEL_NAME:-hephaestus}"
HOSTNAME="${HOSTNAME:-}"
CONFIG_FILE="$STATE_DIR/cloudflared-config.yml"

pid() {
  if [ -s "$PID_FILE" ]; then
    local value
    value="$(cat "$PID_FILE")"
    if kill -0 "$value" 2>/dev/null; then
      printf '%s\n' "$value"
      return 0
    fi
  fi
  pgrep -f "[c]loudflared.*tunnel.*--url ${TARGET_URL}" | head -n 1 || true
}

start() {
  local current
  current="$(pid)"
  if [ -n "$current" ]; then
    echo "Cloudflare tunnel already running (pid $current)"
    cat "$URL_FILE" 2>/dev/null || true
    return 0
  fi
  if [ ! -x "$CLOUDFLARED" ]; then
    echo "cloudflared not found: $CLOUDFLARED" >&2
    exit 1
  fi
  rm -f "$URL_FILE"
  : > "$LOG_FILE"
  setsid "$CLOUDFLARED" tunnel --no-autoupdate --url "$TARGET_URL" >"$LOG_FILE" 2>&1 < /dev/null &
  echo "$!" > "$PID_FILE"
  for _ in $(seq 1 30); do
    local url
    url="$(grep -oE 'https://[-a-zA-Z0-9.]+\\.trycloudflare\\.com' "$LOG_FILE" | tail -n 1 || true)"
    if [ -n "$url" ]; then
      echo "$url" > "$URL_FILE"
      echo "Cloudflare tunnel started: $url"
      return 0
    fi
    sleep 1
  done
  echo "Tunnel started, but URL was not detected yet. See $LOG_FILE" >&2
  return 1
}

stop() {
  local current
  current="$(pid)"
  if [ -n "$current" ]; then
    kill "$current" 2>/dev/null || true
    rm -f "$PID_FILE"
    echo "Cloudflare tunnel stopped (pid $current)"
  else
    echo "Cloudflare tunnel is not running"
  fi
}

status() {
  local current
  current="$(pid)"
  if [ -n "$current" ]; then
    echo "Cloudflare tunnel running (pid $current)"
    cat "$URL_FILE" 2>/dev/null || true
  else
    echo "Cloudflare tunnel is not running"
  fi
}

login() {
  "$CLOUDFLARED" tunnel login
}

create() {
  "$CLOUDFLARED" tunnel create "$TUNNEL_NAME"
}

route_dns() {
  if [ -z "$HOSTNAME" ]; then
    echo "Set HOSTNAME, for example: HOSTNAME=ai.example.com $0 route" >&2
    exit 2
  fi
  "$CLOUDFLARED" tunnel route dns "$TUNNEL_NAME" "$HOSTNAME"
}

write_config() {
  if [ -z "$HOSTNAME" ]; then
    echo "Set HOSTNAME, for example: HOSTNAME=ai.example.com $0 named-start" >&2
    exit 2
  fi
  cat > "$CONFIG_FILE" <<EOF
tunnel: $TUNNEL_NAME
credentials-file: $HOME/.cloudflared/$TUNNEL_NAME.json
ingress:
  - hostname: $HOSTNAME
    service: $TARGET_URL
  - service: http_status:404
EOF
  echo "$CONFIG_FILE"
}

named_start() {
  local current
  current="$(pid)"
  if [ -n "$current" ]; then
    echo "Cloudflare tunnel already running (pid $current)"
    cat "$URL_FILE" 2>/dev/null || true
    return 0
  fi
  write_config >/dev/null
  : > "$LOG_FILE"
  setsid "$CLOUDFLARED" tunnel --no-autoupdate --config "$CONFIG_FILE" run "$TUNNEL_NAME" >"$LOG_FILE" 2>&1 < /dev/null &
  echo "$!" > "$PID_FILE"
  echo "https://$HOSTNAME" > "$URL_FILE"
  echo "Cloudflare named tunnel started: https://$HOSTNAME"
}

case "${1:-}" in
  start) start ;;
  login) login ;;
  create) create ;;
  route) route_dns ;;
  named-start) named_start ;;
  named-restart) stop; named_start ;;
  stop) stop ;;
  restart) stop; start ;;
  status) status ;;
  logs) tail -n "${2:-80}" -f "$LOG_FILE" ;;
  *)
    echo "Usage: $0 {start|login|create|route|named-start|named-restart|stop|restart|status|logs}" >&2
    exit 2
    ;;
esac
