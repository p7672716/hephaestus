from __future__ import annotations

import asyncio
from collections import deque
from dataclasses import dataclass
import json
import os
from pathlib import Path
import shutil
import time
from typing import Any, AsyncIterator

from .model_catalog import MODEL_CATALOG, ModelConfig, get_model, route_model


@dataclass
class RuntimePaths:
    root: Path
    models: Path
    state_file: Path
    build_info: Path
    llama_build: Path


class RuntimeManager:
    def __init__(self, project_root: Path) -> None:
        self.project_root = project_root
        self.paths = RuntimePaths(
            root=project_root / ".hephaestus",
            models=project_root / "models",
            state_file=project_root / ".hephaestus" / "runtime_state.json",
            build_info=project_root / ".hephaestus" / "build_info.json",
            llama_build=project_root / ".hephaestus" / "llama.cpp" / "build" / "bin" / "llama-server",
        )
        self.host = os.environ.get("HEPHAESTUS_LLAMA_HOST", "127.0.0.1")
        self.port = int(os.environ.get("HEPHAESTUS_LLAMA_PORT", "18080"))
        self.provider_preference = os.environ.get("HEPHAESTUS_LLM_PROVIDER", "auto").strip().lower()
        self.ollama_url = os.environ.get("HEPHAESTUS_OLLAMA_URL", "http://127.0.0.1:11434").rstrip("/")
        self.ollama_keep_alive = os.environ.get("HEPHAESTUS_OLLAMA_KEEP_ALIVE", "30m")
        self.ctx_size = os.environ.get("HEPHAESTUS_LLAMA_CTX_SIZE", "8192")
        self.batch_size = os.environ.get("HEPHAESTUS_LLAMA_BATCH_SIZE", "512")
        self.ubatch_size = os.environ.get("HEPHAESTUS_LLAMA_UBATCH_SIZE", "128")
        self.cache_type_k = os.environ.get("HEPHAESTUS_LLAMA_CACHE_TYPE_K", "q8_0")
        self.cache_type_v = os.environ.get("HEPHAESTUS_LLAMA_CACHE_TYPE_V", "q8_0")
        self.threads = os.environ.get("HEPHAESTUS_LLAMA_THREADS", "6")
        self.threads_batch = os.environ.get("HEPHAESTUS_LLAMA_THREADS_BATCH", self.threads)
        self.reasoning = os.environ.get("HEPHAESTUS_LLAMA_REASONING", "off")
        self.no_mmproj = os.environ.get("HEPHAESTUS_LLAMA_NO_MMPROJ", "1").lower() not in {"0", "false", "no"}
        self.show_reasoning = os.environ.get("HEPHAESTUS_SHOW_REASONING", "").lower() in {"1", "true", "yes"}
        self.gpu_layer_step = max(1, int(os.environ.get("HEPHAESTUS_GPU_LAYER_STEP", "1")))
        self.tuning_profile = (
            f"ctx={self.ctx_size};batch={self.batch_size};ubatch={self.ubatch_size};"
            f"k={self.cache_type_k};v={self.cache_type_v};threads={self.threads};"
            f"threads_batch={self.threads_batch};reasoning={self.reasoning};no_mmproj={int(self.no_mmproj)}"
        )
        self.mock = os.environ.get("HEPHAESTUS_LLM_MOCK", "").lower() in {"1", "true", "yes"}
        self._lock = asyncio.Lock()
        self._proc: asyncio.subprocess.Process | None = None
        self._log_task: asyncio.Task[None] | None = None
        self._logs: deque[str] = deque(maxlen=120)
        self._active_model_id: str | None = None
        self._starting_model_id: str | None = None
        self._active_provider: str | None = None
        self._ollama_processor: str | None = None
        self._attempt_gpu_layers: int | None = None
        self._state = self._load_state()
        self._last_error: str | None = None

    @property
    def base_url(self) -> str:
        return f"http://{self.host}:{self.port}"

    def _load_state(self) -> dict[str, Any]:
        try:
            return json.loads(self.paths.state_file.read_text())
        except (FileNotFoundError, json.JSONDecodeError):
            return {"gpu_layers": {}, "last_model_id": None}

    def _save_state(self) -> None:
        self.paths.state_file.parent.mkdir(parents=True, exist_ok=True)
        self.paths.state_file.write_text(json.dumps(self._state, indent=2), encoding="utf-8")

    def _load_build_info(self) -> dict[str, Any]:
        try:
            return json.loads(self.paths.build_info.read_text(encoding="utf-8"))
        except (FileNotFoundError, json.JSONDecodeError):
            return {}

    def _llama_binary(self) -> str | None:
        explicit = os.environ.get("HEPHAESTUS_LLAMA_SERVER")
        if explicit and Path(explicit).exists():
            return explicit
        if self.paths.llama_build.exists():
            return str(self.paths.llama_build)
        return shutil.which("llama-server")

    def _model_path(self, model: ModelConfig) -> Path:
        return self.paths.models / model.local_dir_name / model.filename

    def _initial_gpu_layers_for(self, model: ModelConfig, binary: str) -> int:
        build_info = self._load_build_info()
        saved_layers = self._state.setdefault("gpu_layers", {}).get(model.id)
        profile_matches = self._state.get("tuning_profile") == self.tuning_profile
        gpu_layers = saved_layers if profile_matches and saved_layers is not None else model.initial_gpu_layers
        if build_info.get("cuda") is True and (gpu_layers <= 0 or gpu_layers > model.initial_gpu_layers):
            gpu_layers = model.initial_gpu_layers
        if binary == str(self.paths.llama_build) and build_info.get("cuda") is False:
            gpu_layers = 0
        return gpu_layers

    def status(self) -> dict[str, Any]:
        prepared = {
            model_id: self._model_path(model).exists()
            for model_id, model in MODEL_CATALOG.items()
        }
        active = MODEL_CATALOG.get(self._active_model_id or "")
        starting = MODEL_CATALOG.get(self._starting_model_id or "")
        binary = self._llama_binary()
        llama_running = self._proc is not None and self._proc.returncode is None
        ollama_running = self._active_provider == "ollama" and active is not None
        process_running = llama_running or ollama_running
        active_layers = None
        status_model = active or starting
        if status_model:
            active_layers = self._state.get("gpu_layers", {}).get(status_model.id)
            if starting and not active:
                if self._attempt_gpu_layers is not None:
                    active_layers = self._attempt_gpu_layers
                elif binary:
                    active_layers = self._initial_gpu_layers_for(status_model, binary)
        build_info = self._load_build_info()
        state = "mock" if self.mock else ("ready" if process_running and active else "idle")
        if process_running and starting and not active:
            state = "starting"
        if self._last_error:
            state = "error" if not process_running and not self.mock else state
        acceleration = None
        if self.mock:
            acceleration = "mock"
        elif self._active_provider == "ollama" and process_running:
            acceleration = self._ollama_processor or "Ollama"
        elif llama_running and active_layers == 0:
            acceleration = "CPU fallback"
        elif llama_running and active_layers is not None:
            acceleration = f"GPU layers {active_layers}"
        elif build_info.get("cuda") is False:
            acceleration = "CPU fallback"
        return {
            "state": state,
            "mock": self.mock,
            "provider": self._active_provider or self.provider_preference,
            "active_model_id": self._active_model_id,
            "active_model_label": active.label if active else None,
            "starting_model_id": self._starting_model_id,
            "starting_model_label": starting.label if starting else None,
            "base_url": self.base_url,
            "ollama_url": self.ollama_url,
            "llama_server": binary,
            "cuda_build": build_info.get("cuda"),
            "acceleration": acceleration,
            "ctx_size": self.ctx_size,
            "batch_size": self.batch_size,
            "ubatch_size": self.ubatch_size,
            "cache_type_k": self.cache_type_k,
            "cache_type_v": self.cache_type_v,
            "threads": self.threads,
            "threads_batch": self.threads_batch,
            "reasoning": self.reasoning,
            "no_mmproj": self.no_mmproj,
            "show_reasoning": self.show_reasoning,
            "prepared": prepared,
            "gpu_layers": self._state.get("gpu_layers", {}),
            "last_error": self._last_error,
            "logs": list(self._logs)[-20:],
        }

    async def prepare_model(self, model_id: str) -> dict[str, Any]:
        model = get_model(model_id)
        path = self._model_path(model)
        if path.exists():
            return {"model_id": model.id, "path": str(path), "prepared": True, "downloaded": False}

        self.paths.models.mkdir(parents=True, exist_ok=True)
        target_dir = self.paths.models / model.local_dir_name
        target_dir.mkdir(parents=True, exist_ok=True)
        try:
            from huggingface_hub import hf_hub_download
        except ImportError as exc:
            raise RuntimeError("huggingface_hub is not installed. Run scripts/setup_runtime.sh first.") from exc

        def download() -> str:
            return hf_hub_download(
                repo_id=model.repo_id,
                filename=model.filename,
                local_dir=str(target_dir),
            )

        downloaded_path = await asyncio.to_thread(download)
        return {"model_id": model.id, "path": downloaded_path, "prepared": True, "downloaded": True}

    async def _ollama_available(self) -> bool:
        if not shutil.which("ollama"):
            return False
        try:
            import httpx
        except ImportError:
            return False

        try:
            async with httpx.AsyncClient(timeout=1.5) as client:
                response = await client.get(f"{self.ollama_url}/api/version")
            return response.status_code < 500
        except httpx.HTTPError:
            return False

    async def _resolve_provider(self) -> str:
        preference = self.provider_preference
        if preference in {"llama", "llamacpp", "llama.cpp"}:
            return "llama.cpp"
        if preference == "ollama":
            if not await self._ollama_available():
                raise RuntimeError("Ollama is not available on HEPHAESTUS_OLLAMA_URL.")
            return "ollama"
        if await self._ollama_available():
            return "ollama"
        return "llama.cpp"

    async def _ollama_has_model(self, model: ModelConfig) -> bool:
        try:
            import httpx
        except ImportError as exc:
            raise RuntimeError("httpx is not installed. Run scripts/setup_runtime.sh first.") from exc

        async with httpx.AsyncClient(timeout=5) as client:
            response = await client.get(f"{self.ollama_url}/api/tags")
            if response.status_code >= 400:
                return False
            names = {
                item.get("name") or item.get("model")
                for item in response.json().get("models", [])
            }
        return model.ollama_model in names

    async def _prepare_ollama_model(self, model: ModelConfig) -> None:
        try:
            import httpx
        except ImportError as exc:
            raise RuntimeError("httpx is not installed. Run scripts/setup_runtime.sh first.") from exc

        if await self._ollama_has_model(model):
            return
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.post(
                f"{self.ollama_url}/api/pull",
                json={"model": model.ollama_model, "stream": False},
            )
            if response.status_code >= 400:
                raise RuntimeError(response.text[:800])

    async def stop(self) -> dict[str, Any]:
        async with self._lock:
            await self._stop_unlocked()
            await self._stop_known_ollama_models()
            self._active_model_id = None
            self._starting_model_id = None
            self._active_provider = None
            self._ollama_processor = None
            self._last_error = None
            self._state["last_model_id"] = None
            self._save_state()
            return self.status()

    async def unload_on_startup(self) -> None:
        async with self._lock:
            await self._stop_unlocked()
            await self._stop_known_ollama_models()
            self._active_model_id = None
            self._starting_model_id = None
            self._active_provider = None
            self._ollama_processor = None
            self._last_error = None
            self._state["last_model_id"] = None
            self._save_state()

    async def _stop_known_ollama_models(self) -> None:
        if not shutil.which("ollama"):
            return
        for model in MODEL_CATALOG.values():
            await self._stop_ollama_model(model.ollama_model)

    async def select_model(self, model_id: str, provider: str | None = None) -> dict[str, Any]:
        async with self._lock:
            model = get_model(model_id)
            if self.mock:
                self._active_model_id = model.id
                self._active_provider = "mock"
                self._state["last_model_id"] = model.id
                self._last_error = None
                self._save_state()
                return self.status()
            provider = provider or await self._resolve_provider()
            if (
                self._active_model_id == model.id
                and self._active_provider == provider
                and (self._proc and self._proc.returncode is None or provider == "ollama")
            ):
                return self.status()
            if provider == "ollama":
                await self._select_ollama_model(model)
                return self.status()
            await self._start_unlocked(model)
            return self.status()

    async def _stop_unlocked(self) -> None:
        if self._active_provider == "ollama" and self._active_model_id:
            await self._stop_ollama_model(get_model(self._active_model_id).ollama_model)
        if self._proc and self._proc.returncode is None:
            self._proc.terminate()
            try:
                await asyncio.wait_for(self._proc.wait(), timeout=8)
            except asyncio.TimeoutError:
                self._proc.kill()
                await self._proc.wait()
        self._proc = None
        if self._log_task:
            self._log_task.cancel()
            self._log_task = None
        self._attempt_gpu_layers = None
        self._ollama_processor = None

    async def _stop_ollama_model(self, model_name: str) -> None:
        binary = shutil.which("ollama")
        if not binary:
            return
        proc = await asyncio.create_subprocess_exec(
            binary,
            "stop",
            model_name,
            stdout=asyncio.subprocess.DEVNULL,
            stderr=asyncio.subprocess.DEVNULL,
        )
        try:
            await asyncio.wait_for(proc.wait(), timeout=20)
        except asyncio.TimeoutError:
            proc.kill()
            await proc.wait()

    async def _select_ollama_model(self, model: ModelConfig) -> None:
        await self._stop_unlocked()
        self._active_model_id = None
        self._starting_model_id = model.id
        self._active_provider = "ollama"
        self._attempt_gpu_layers = None
        self._last_error = None
        await self._prepare_ollama_model(model)

        try:
            import httpx
        except ImportError as exc:
            raise RuntimeError("httpx is not installed. Run scripts/setup_runtime.sh first.") from exc

        body = {
            "model": model.ollama_model,
            "messages": [{"role": "user", "content": "."}],
            "stream": False,
            "think": False,
            "keep_alive": self.ollama_keep_alive,
            "options": {
                "num_ctx": int(self.ctx_size),
                "num_predict": 1,
                "temperature": 0,
            },
        }
        async with httpx.AsyncClient(timeout=None) as client:
            response = await client.post(f"{self.ollama_url}/api/chat", json=body)
            if response.status_code >= 400:
                self._active_provider = None
                self._starting_model_id = None
                self._last_error = response.text[:800]
                raise RuntimeError(self._last_error)

        self._active_model_id = model.id
        self._starting_model_id = None
        self._state["last_model_id"] = model.id
        self._state["provider"] = "ollama"
        self._last_error = None
        self._ollama_processor = await self._read_ollama_acceleration(model)
        self._save_state()

    async def _read_ollama_acceleration(self, model: ModelConfig) -> str:
        try:
            import httpx
        except ImportError:
            return "Ollama"

        try:
            async with httpx.AsyncClient(timeout=2) as client:
                response = await client.get(f"{self.ollama_url}/api/ps")
            if response.status_code >= 400:
                return "Ollama"
            for item in response.json().get("models", []):
                if (item.get("name") or item.get("model")) != model.ollama_model:
                    continue
                size = item.get("size") or 0
                size_vram = item.get("size_vram") or 0
                if size and size_vram:
                    gpu = round(size_vram / size * 100)
                    return f"Ollama {gpu}% GPU"
                return "Ollama"
        except httpx.HTTPError:
            return "Ollama"
        return "Ollama"

    async def _start_unlocked(self, model: ModelConfig) -> None:
        binary = self._llama_binary()
        if not binary:
            raise RuntimeError("llama-server was not found. Run scripts/setup_runtime.sh first.")
        prepared = await self.prepare_model(model.id)
        model_path = prepared["path"]
        await self._stop_unlocked()
        self._active_model_id = None
        self._starting_model_id = model.id
        self._active_provider = "llama.cpp"
        self._attempt_gpu_layers = None
        self._last_error = None

        gpu_layers = self._initial_gpu_layers_for(model, binary)
        attempts = []
        while gpu_layers >= 0:
            attempts.append(gpu_layers)
            self._attempt_gpu_layers = gpu_layers
            self._logs.clear()
            cmd = [
                binary,
                "-m",
                model_path,
                "--host",
                self.host,
                "--port",
                str(self.port),
                "--alias",
                model.repo_id,
                "--ctx-size",
                self.ctx_size,
                "--batch-size",
                self.batch_size,
                "--ubatch-size",
                self.ubatch_size,
                "--cache-type-k",
                self.cache_type_k,
                "--cache-type-v",
                self.cache_type_v,
                "-t",
                self.threads,
                "-tb",
                self.threads_batch,
                "--reasoning",
                self.reasoning,
                "--parallel",
                "1",
                "--flash-attn",
                "auto",
                "--jinja",
                "--n-gpu-layers",
                str(gpu_layers),
            ]
            if self.no_mmproj:
                cmd.append("--no-mmproj")
            self._proc = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.STDOUT,
            )
            self._log_task = asyncio.create_task(self._capture_logs(self._proc.stdout))
            if await self._wait_until_ready():
                self._active_model_id = model.id
                self._starting_model_id = None
                self._active_provider = "llama.cpp"
                self._attempt_gpu_layers = None
                self._state["last_model_id"] = model.id
                self._state["provider"] = "llama.cpp"
                self._state["gpu_layers"][model.id] = gpu_layers
                self._state["tuning_profile"] = self.tuning_profile
                self._last_error = None
                self._save_state()
                return
            await self._stop_unlocked()
            if gpu_layers == 0:
                break
            gpu_layers = max(0, gpu_layers - self.gpu_layer_step)

        self._active_model_id = None
        self._starting_model_id = None
        self._attempt_gpu_layers = None
        self._last_error = f"Failed to start {model.label}. Tried n_gpu_layers={attempts}."
        self._save_state()
        raise RuntimeError(f"{self._last_error} Recent logs: {' | '.join(list(self._logs)[-8:])}")

    async def _capture_logs(self, stream: asyncio.StreamReader | None) -> None:
        if stream is None:
            return
        while True:
            line = await stream.readline()
            if not line:
                break
            self._logs.append(line.decode("utf-8", errors="replace").rstrip())

    async def _wait_until_ready(self) -> bool:
        timeout = float(os.environ.get("HEPHAESTUS_LLAMA_START_TIMEOUT", "240"))
        deadline = time.monotonic() + timeout
        try:
            import httpx
        except ImportError as exc:
            raise RuntimeError("httpx is not installed. Run scripts/setup_runtime.sh first.") from exc

        async with httpx.AsyncClient(timeout=2) as client:
            while time.monotonic() < deadline:
                if self._proc and self._proc.returncode is not None:
                    return False
                for path in ("/health", "/v1/models"):
                    try:
                        response = await client.get(f"{self.base_url}{path}")
                        if response.status_code < 500:
                            return True
                    except httpx.HTTPError:
                        pass
                await asyncio.sleep(1)
        return False

    async def chat_events(self, payload: dict[str, Any]) -> AsyncIterator[dict[str, Any]]:
        text = payload.get("last_user_text") or ""
        messages = payload.get("messages") or []
        selection = payload.get("selection") or "auto"
        surface = payload.get("surface") or "chat"
        route = route_model(selection, text, surface)
        model = get_model(route["model_id"])
        provider = "mock" if self.mock else await self._resolve_provider()
        yield {"type": "start", **route, "mock": self.mock, "provider": provider}

        if self.mock:
            async for event in self._mock_chat_events(text, route):
                yield event
            return

        await self.select_model(model.id, provider=provider)
        if provider == "ollama":
            async for event in self._ollama_chat_events(payload, route, model):
                yield event
            return

        try:
            import httpx
        except ImportError as exc:
            raise RuntimeError("httpx is not installed. Run scripts/setup_runtime.sh first.") from exc

        body = {
            "model": model.repo_id,
            "messages": messages,
            "stream": True,
            "temperature": 0.6 if model.id == "ornith" else 0.4,
            "top_p": 0.9,
            "max_tokens": payload.get("max_tokens", 4096),
        }
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", f"{self.base_url}/v1/chat/completions", json=body) as response:
                if response.status_code >= 400:
                    detail = await response.aread()
                    raise RuntimeError(detail.decode("utf-8", errors="replace")[:800])
                async for line in response.aiter_lines():
                    if not line.startswith("data:"):
                        continue
                    data = line[5:].strip()
                    if data == "[DONE]":
                        break
                    try:
                        item = json.loads(data)
                    except json.JSONDecodeError:
                        continue
                    delta = (item.get("choices") or [{}])[0].get("delta") or {}
                    reasoning = delta.get("reasoning_content") or ""
                    if reasoning and (self.show_reasoning or payload.get("reasoning_enabled")):
                        yield {"type": "progress", "text": reasoning}
                    token = delta.get("content") or ""
                    if token:
                        yield {"type": "token", "text": token}
        yield {"type": "done", **route, "provider": provider}

    async def _ollama_chat_events(
        self,
        payload: dict[str, Any],
        route: dict[str, str],
        model: ModelConfig,
    ) -> AsyncIterator[dict[str, Any]]:
        try:
            import httpx
        except ImportError as exc:
            raise RuntimeError("httpx is not installed. Run scripts/setup_runtime.sh first.") from exc

        body = {
            "model": model.ollama_model,
            "messages": payload.get("messages") or [],
            "stream": True,
            "think": bool(payload.get("reasoning_enabled")),
            "keep_alive": self.ollama_keep_alive,
            "options": {
                "num_ctx": int(self.ctx_size),
                "num_predict": payload.get("max_tokens", 4096),
                "temperature": 0.6 if model.id == "ornith" else 0.4,
                "top_p": 0.9,
            },
        }
        final: dict[str, Any] = {}
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream("POST", f"{self.ollama_url}/api/chat", json=body) as response:
                if response.status_code >= 400:
                    detail = await response.aread()
                    raise RuntimeError(detail.decode("utf-8", errors="replace")[:800])
                async for line in response.aiter_lines():
                    if not line:
                        continue
                    try:
                        item = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    message = item.get("message") or {}
                    thinking = message.get("thinking") or ""
                    if thinking:
                        yield {"type": "progress", "text": thinking}
                    token = message.get("content") or ""
                    if token:
                        yield {"type": "token", "text": token}
                    if item.get("done"):
                        final = item
                        break
        yield {"type": "done", **route, "provider": "ollama", "metrics": self._ollama_metrics(final)}

    def _ollama_metrics(self, final: dict[str, Any]) -> dict[str, Any]:
        eval_count = int(final.get("eval_count") or 0)
        eval_duration = int(final.get("eval_duration") or 0)
        prompt_count = int(final.get("prompt_eval_count") or 0)
        prompt_duration = int(final.get("prompt_eval_duration") or 0)
        duration = int(final.get("total_duration") or 0)
        return {
            "tokens": eval_count,
            "tokensPerSecond": eval_count / (eval_duration / 1_000_000_000) if eval_count and eval_duration else None,
            "durationMs": duration / 1_000_000 if duration else None,
            "promptTokens": prompt_count,
            "promptTokensPerSecond": prompt_count / (prompt_duration / 1_000_000_000) if prompt_count and prompt_duration else None,
            "doneReason": final.get("done_reason"),
        }

    async def _mock_chat_events(self, text: str, route: dict[str, str]) -> AsyncIterator[dict[str, Any]]:
        model = route["model_label"]
        message = (
            f"{model} mock response. 受信: {text or 'empty prompt'}\n\n"
            "実モデル接続時は同じ画面でSSEストリーミングされます。"
        )
        for chunk in message.split(" "):
            await asyncio.sleep(0.04)
            yield {"type": "token", "text": chunk + " "}
        yield {"type": "done", **route}
