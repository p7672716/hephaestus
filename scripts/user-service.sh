#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
UNIT_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/systemd/user"
UNIT_FILE="$UNIT_DIR/hephaestus.service"
PYTHON="${PYTHON:-$ROOT/.venv/bin/python}"
PORT="${PORT:-8787}"
HOST="${HOST:-0.0.0.0}"

if [ ! -x "$PYTHON" ]; then
  PYTHON="python3"
fi

write_unit() {
  mkdir -p "$UNIT_DIR"
  cat > "$UNIT_FILE" <<EOF
[Unit]
Description=Hephaestus local AI service
After=network-online.target

[Service]
Type=simple
WorkingDirectory=$ROOT
ExecStart=$PYTHON -m uvicorn hephaestus_server.app:app --host $HOST --port $PORT
Restart=on-failure
RestartSec=2
KillSignal=SIGTERM

[Install]
WantedBy=default.target
EOF
  systemctl --user daemon-reload
}

install_service() {
  write_unit
  if command -v loginctl >/dev/null 2>&1; then
    sudo loginctl enable-linger "$USER" || true
  fi
  systemctl --user enable --now hephaestus.service
  systemctl --user status hephaestus.service --no-pager
}

case "${1:-}" in
  install) install_service ;;
  start) systemctl --user start hephaestus.service ;;
  stop) systemctl --user stop hephaestus.service ;;
  restart) systemctl --user restart hephaestus.service ;;
  status) systemctl --user status hephaestus.service --no-pager ;;
  logs) journalctl --user -u hephaestus.service -f ;;
  uninstall)
    systemctl --user disable --now hephaestus.service 2>/dev/null || true
    rm -f "$UNIT_FILE"
    systemctl --user daemon-reload
    ;;
  *)
    echo "Usage: $0 {install|start|stop|restart|status|logs|uninstall}" >&2
    exit 2
    ;;
esac
