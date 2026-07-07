from __future__ import annotations

import json
from pathlib import Path
from typing import Any, AsyncIterator

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from .auth import AuthManager
from .model_catalog import public_models, route_model
from .runtime import RuntimeManager


PROJECT_ROOT = Path(__file__).resolve().parent.parent
UI_ROOT = PROJECT_ROOT / "Hephaestus_UI"
auth = AuthManager(PROJECT_ROOT)
runtime = RuntimeManager(PROJECT_ROOT)

app = FastAPI(
    title="Hephaestus Local Backend",
    docs_url="/api/docs",
    redoc_url=None,
    openapi_url="/api/openapi.json",
)


@app.on_event("startup")
async def startup_unload_runtime() -> None:
    await runtime.unload_on_startup()


class RuntimeSelectRequest(BaseModel):
    model_id: str = Field(..., pattern="^(agents-a1|ornith)$")


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatStreamRequest(BaseModel):
    messages: list[ChatMessage]
    selection: str = "auto"
    surface: str = "chat"
    session_id: str | None = None
    max_tokens: int = Field(default=4096, ge=1, le=8192)
    reasoning_enabled: bool = False


class AuthLoginRequest(BaseModel):
    token: str


def sse(event: str, data: dict[str, Any]) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@app.middleware("http")
async def auth_gate(request: Request, call_next):
    public_auth_paths = {"/api/auth/status", "/api/auth/login"}
    path = request.url.path
    if path in public_auth_paths or not path.startswith("/api/") or auth.authenticated(request):
        return await call_next(request)
    return JSONResponse({"detail": "auth required"}, status_code=401)


@app.get("/api/auth/status")
async def auth_status(request: Request) -> dict[str, Any]:
    return auth.status(request)


@app.post("/api/auth/login")
async def auth_login(body: AuthLoginRequest, response: Response) -> dict[str, Any]:
    if not auth.token_matches(body.token):
        raise HTTPException(status_code=401, detail="invalid token")
    auth.trust(response)
    return {"ok": True, "authenticated": True}


@app.post("/api/auth/logout")
async def auth_logout(request: Request, response: Response) -> dict[str, Any]:
    auth.forget(request, response)
    return {"ok": True}


@app.post("/api/auth/token/regenerate")
async def auth_token_regenerate(response: Response) -> dict[str, Any]:
    return {"token": auth.regenerate_token(response)}


@app.get("/api/health")
async def health() -> dict[str, Any]:
    return {"ok": True, "runtime": runtime.status()}


@app.get("/api/models")
async def models() -> dict[str, Any]:
    status = runtime.status()
    return {"models": public_models(), "runtime": status}


@app.post("/api/models/{model_id}/prepare")
async def prepare_model(model_id: str) -> dict[str, Any]:
    try:
        return await runtime.prepare_model(model_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.get("/api/runtime/status")
async def runtime_status() -> dict[str, Any]:
    return runtime.status()


@app.post("/api/runtime/select")
async def runtime_select(body: RuntimeSelectRequest) -> dict[str, Any]:
    try:
        return await runtime.select_model(body.model_id)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@app.post("/api/runtime/stop")
async def runtime_stop() -> dict[str, Any]:
    return await runtime.stop()


@app.post("/api/chat/stream")
async def chat_stream(body: ChatStreamRequest, request: Request) -> StreamingResponse:
    messages = [message.model_dump() for message in body.messages]
    last_user = next((message["content"] for message in reversed(messages) if message["role"] == "user"), "")
    route = route_model(body.selection, last_user, body.surface)

    async def events() -> AsyncIterator[str]:
        started = False
        try:
            payload = {
                "messages": messages,
                "selection": body.selection,
                "surface": body.surface,
                "session_id": body.session_id,
                "max_tokens": body.max_tokens,
                "reasoning_enabled": body.reasoning_enabled,
                "last_user_text": last_user,
            }
            async for event in runtime.chat_events(payload):
                if await request.is_disconnected():
                    break
                event_type = event.pop("type", "message")
                if event_type == "start":
                    started = True
                yield sse(event_type, event)
        except Exception as exc:
            if not started:
                yield sse("start", {**route, "mock": runtime.mock})
            yield sse("error", {"message": str(exc), **route})

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


@app.get("/")
async def index() -> FileResponse:
    return FileResponse(UI_ROOT / "index.html")


app.mount("/", StaticFiles(directory=UI_ROOT, html=True), name="ui")
