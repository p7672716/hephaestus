import asyncio
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch

from hephaestus_server.model_catalog import get_model
from hephaestus_server.runtime import RuntimeManager


class RuntimeMockTests(unittest.TestCase):
    def test_status_reports_starting_model(self):
        class DummyProcess:
            returncode = None

        with tempfile.TemporaryDirectory() as tmp:
            runtime = RuntimeManager(Path(tmp))
            runtime._proc = DummyProcess()
            runtime._starting_model_id = "ornith"
            status = runtime.status()

        self.assertEqual(status["state"], "starting")
        self.assertIsNone(status["active_model_id"])
        self.assertEqual(status["starting_model_id"], "ornith")

    def test_cuda_build_prefers_tuned_initial_layers(self):
        with tempfile.TemporaryDirectory() as tmp:
            runtime = RuntimeManager(Path(tmp))
            runtime._state["gpu_layers"]["ornith"] = 4

            with patch.object(runtime, "_load_build_info", return_value={"cuda": True}):
                gpu_layers = runtime._initial_gpu_layers_for(
                    get_model("ornith"),
                    str(runtime.paths.llama_build),
                )

        self.assertEqual(gpu_layers, 13)

    def test_cuda_build_reuses_layers_for_current_tuning_profile(self):
        with tempfile.TemporaryDirectory() as tmp:
            runtime = RuntimeManager(Path(tmp))
            runtime._state["gpu_layers"]["ornith"] = 8
            runtime._state["tuning_profile"] = runtime.tuning_profile

            with patch.object(runtime, "_load_build_info", return_value={"cuda": True}):
                gpu_layers = runtime._initial_gpu_layers_for(
                    get_model("ornith"),
                    str(runtime.paths.llama_build),
                )

        self.assertEqual(gpu_layers, 8)

    def test_status_reports_current_start_attempt_layers(self):
        class DummyProcess:
            returncode = None

        with tempfile.TemporaryDirectory() as tmp:
            runtime = RuntimeManager(Path(tmp))
            runtime._proc = DummyProcess()
            runtime._starting_model_id = "ornith"
            runtime._attempt_gpu_layers = 8
            status = runtime.status()

        self.assertEqual(status["state"], "starting")
        self.assertEqual(status["acceleration"], "GPU layers 8")

    def test_mock_chat_events_emit_start_token_done(self):
        async def run():
            with tempfile.TemporaryDirectory() as tmp:
                with patch.dict("os.environ", {"HEPHAESTUS_LLM_MOCK": "1"}):
                    runtime = RuntimeManager(Path(tmp))
                    events = []
                    async for event in runtime.chat_events({
                        "messages": [{"role": "user", "content": "方針を整理して"}],
                        "selection": "auto",
                        "surface": "chat",
                        "last_user_text": "方針を整理して",
                    }):
                        events.append(event)
                    return events

        events = asyncio.run(run())
        self.assertEqual(events[0]["type"], "start")
        self.assertEqual(events[0]["model_id"], "agents-a1")
        self.assertTrue(any(event["type"] == "token" for event in events))
        self.assertEqual(events[-1]["type"], "done")

    def test_ollama_metrics_include_done_reason(self):
        with tempfile.TemporaryDirectory() as tmp:
            runtime = RuntimeManager(Path(tmp))
            metrics = runtime._ollama_metrics({
                "eval_count": 2,
                "eval_duration": 1_000_000_000,
                "done_reason": "length",
            })

        self.assertEqual(metrics["tokens"], 2)
        self.assertEqual(metrics["doneReason"], "length")


if __name__ == "__main__":
    unittest.main()
