#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV="$ROOT/.venv"
LLAMA_DIR="$ROOT/.hephaestus/llama.cpp"
BUILD_INFO="$ROOT/.hephaestus/build_info.json"

if [ -d /usr/local/cuda/bin ]; then
  export PATH="/usr/local/cuda/bin:$PATH"
fi

cd "$ROOT"

install_system_packages() {
  if command -v apt-get >/dev/null 2>&1; then
    if command -v sudo >/dev/null 2>&1; then
      sudo apt-get update
      sudo apt-get install -y python3-venv python3-pip build-essential cmake ninja-build git curl
    else
      echo "sudo not found; install python3-venv python3-pip build-essential cmake ninja-build git curl manually."
    fi
  fi
}

install_system_packages

if ! python3 -m venv "$VENV"; then
  echo "Failed to create .venv. Install python3-venv/python3-pip first, then rerun this script."
  exit 1
fi
"$VENV/bin/python" -m ensurepip --upgrade >/dev/null 2>&1 || true
"$VENV/bin/python" -m pip install --upgrade pip
"$VENV/bin/python" -m pip install -r requirements.txt

mkdir -p "$(dirname "$LLAMA_DIR")"
if [ ! -d "$LLAMA_DIR/.git" ]; then
  git clone https://github.com/ggml-org/llama.cpp "$LLAMA_DIR"
else
  git -C "$LLAMA_DIR" pull --ff-only
fi

CUDA_FLAG="-DGGML_CUDA=OFF"
CUDA_ENABLED=false
if command -v nvcc >/dev/null 2>&1; then
  CUDA_FLAG="-DGGML_CUDA=ON"
  CUDA_ENABLED=true
fi

cmake -S "$LLAMA_DIR" -B "$LLAMA_DIR/build" -G Ninja "$CUDA_FLAG" -DCMAKE_BUILD_TYPE=Release
cmake --build "$LLAMA_DIR/build" --target llama-server llama-cli
printf '{\n  "cuda": %s,\n  "builder": "setup_runtime.sh"\n}\n' "$CUDA_ENABLED" > "$BUILD_INFO"

echo "Runtime ready."
echo "Run mock server: HEPHAESTUS_LLM_MOCK=1 $VENV/bin/uvicorn hephaestus_server.app:app --host 127.0.0.1 --port 8787"
echo "Run real server: $VENV/bin/uvicorn hephaestus_server.app:app --host 127.0.0.1 --port 8787"
