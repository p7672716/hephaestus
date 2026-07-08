# Hephaestus

Hephaestus is a local AI control surface for Ollama and llama.cpp. The backend remains a small FastAPI service; the active UI is being migrated to React, TypeScript, Vite, and React Compiler.

## Development

Prepare the Python and llama.cpp runtime first:

```bash
bash scripts/setup_runtime.sh
```

Run the React development server and FastAPI together:

```bash
bash scripts/run_react_dev.sh
```

Open `http://127.0.0.1:5173`. Vite proxies `/api` to FastAPI on port 8787.

For UI-only development with a mock model:

```bash
HEPHAESTUS_LLM_MOCK=1 bash scripts/run_react_dev.sh
```

## Production UI

```bash
bash scripts/build_ui.sh
bash scripts/run_dev.sh
```

After `frontend/dist/index.html` exists, FastAPI serves the React build. Until then it falls back to the legacy `Hephaestus_UI` directory, so backend-only workflows remain usable during the migration.

## Architecture

- `frontend/src/api.ts`: typed REST and SSE client
- `frontend/src/hooks/useRuntime.ts`: runtime polling and model lifecycle
- `frontend/src/hooks/useChat.ts`: sessions, local persistence, cancellation, and animation-frame-batched token updates
- `frontend/src/components`: isolated view and shell components
- `hephaestus_server`: authentication, routing, model download, Ollama, and llama.cpp process control

Chat, authentication, runtime status, model routing, reasoning progress, and generation cancellation are implemented in React. The remaining surfaces are explicit migration boundaries rather than more state added to a monolithic client file.
