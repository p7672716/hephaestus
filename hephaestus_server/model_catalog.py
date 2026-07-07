from __future__ import annotations

from dataclasses import asdict, dataclass
import re


@dataclass(frozen=True)
class ModelConfig:
    id: str
    label: str
    repo_id: str
    filename: str
    ollama_model: str
    role: str
    initial_gpu_layers: int

    @property
    def local_dir_name(self) -> str:
        return self.id


MODEL_CATALOG: dict[str, ModelConfig] = {
    "agents-a1": ModelConfig(
        id="agents-a1",
        label="Agents-A1",
        repo_id="InternScience/Agents-A1-Q4_K_M-GGUF",
        filename="Agents-A1-Q4_K_M.gguf",
        ollama_model="hf.co/InternScience/Agents-A1-Q4_K_M-GGUF:Q4_K_M",
        role="research",
        initial_gpu_layers=14,
    ),
    "ornith": ModelConfig(
        id="ornith",
        label="Ornith",
        repo_id="deepreinforce-ai/Ornith-1.0-35B-GGUF",
        filename="ornith-1.0-35b-Q4_K_M.gguf",
        ollama_model="hf.co/deepreinforce-ai/Ornith-1.0-35B-GGUF:Q4_K_M",
        role="coding",
        initial_gpu_layers=13,
    ),
}

CODING_PATTERN = re.compile(
    r"実装|修正|テスト|ビルド|エラー|失敗|不具合|バグ|差分|変更|"
    r"implement|fix|test|build|error|fail|bug|refactor|diff|patch",
    re.IGNORECASE,
)


def public_models() -> list[dict[str, object]]:
    return [asdict(model) for model in MODEL_CATALOG.values()]


def get_model(model_id: str) -> ModelConfig:
    try:
        return MODEL_CATALOG[model_id]
    except KeyError as exc:
        valid = ", ".join(sorted(MODEL_CATALOG))
        raise ValueError(f"Unknown model '{model_id}'. Valid models: {valid}") from exc


def route_model(selection: str, text: str, surface: str = "chat") -> dict[str, str]:
    normalized = (selection or "auto").strip().lower()
    if normalized in MODEL_CATALOG:
        model = MODEL_CATALOG[normalized]
        return {
            "model_id": model.id,
            "model_label": model.label,
            "task_kind": model.role if model.role != "research" else "analysis",
            "route_reason": "manual selection",
        }

    if surface == "coding" or CODING_PATTERN.search(text or ""):
        model = MODEL_CATALOG["ornith"]
        return {
            "model_id": model.id,
            "model_label": model.label,
            "task_kind": "coding",
            "route_reason": "coding/edit/test signal",
        }

    model = MODEL_CATALOG["agents-a1"]
    return {
        "model_id": model.id,
        "model_label": model.label,
        "task_kind": "analysis",
        "route_reason": "analysis/research default",
    }
