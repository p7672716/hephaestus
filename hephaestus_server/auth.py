from __future__ import annotations

import json
import os
from pathlib import Path
import secrets
import time
from typing import Any

from fastapi import Request, Response


COOKIE_NAME = "hephaestus_device"


class AuthManager:
    def __init__(self, project_root: Path) -> None:
        self.path = project_root / ".hephaestus" / "auth.json"
        self._state = self._load()

    def _load(self) -> dict[str, Any]:
        try:
            state = json.loads(self.path.read_text(encoding="utf-8"))
        except (FileNotFoundError, json.JSONDecodeError):
            state = {}
        if not state.get("token"):
            state["token"] = self._new_token()
        state.setdefault("trusted_devices", {})
        self._save(state)
        return state

    def _save(self, state: dict[str, Any] | None = None) -> None:
        if state is not None:
            self._state = state
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self.path.write_text(json.dumps(self._state, indent=2), encoding="utf-8")
        try:
            os.chmod(self.path, 0o600)
        except OSError:
            pass

    @staticmethod
    def _new_token() -> str:
        return f"hpst_{secrets.token_urlsafe(32)}"

    @staticmethod
    def is_local(request: Request) -> bool:
        host = request.client.host if request.client else ""
        return host in {"127.0.0.1", "::1", "localhost"}

    def token_matches(self, token: str) -> bool:
        return secrets.compare_digest(token.strip(), self._state["token"])

    def is_trusted(self, request: Request) -> bool:
        device = request.cookies.get(COOKIE_NAME)
        return bool(device and device in self._state.get("trusted_devices", {}))

    def authenticated(self, request: Request) -> bool:
        if self.is_local(request) or self.is_trusted(request):
            return True
        auth = request.headers.get("authorization", "")
        if auth.lower().startswith("bearer "):
            return self.token_matches(auth[7:])
        return False

    def trust(self, response: Response) -> str:
        device = secrets.token_urlsafe(32)
        self._state.setdefault("trusted_devices", {})[device] = int(time.time())
        self._save()
        response.set_cookie(
            COOKIE_NAME,
            device,
            max_age=60 * 60 * 24 * 365,
            httponly=True,
            samesite="lax",
        )
        return device

    def forget(self, request: Request, response: Response) -> None:
        device = request.cookies.get(COOKIE_NAME)
        if device:
            self._state.setdefault("trusted_devices", {}).pop(device, None)
            self._save()
        response.delete_cookie(COOKIE_NAME)

    def regenerate_token(self, response: Response) -> str:
        self._state["token"] = self._new_token()
        self._state["trusted_devices"] = {}
        self._save()
        self.trust(response)
        return self._state["token"]

    def status(self, request: Request) -> dict[str, Any]:
        authenticated = self.authenticated(request)
        return {
            "required": not self.is_local(request),
            "authenticated": authenticated,
            "token": self._state["token"] if authenticated else None,
            "trusted_devices": len(self._state.get("trusted_devices", {})),
        }
