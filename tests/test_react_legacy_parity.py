from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


def react_sources() -> str:
    parts = [(ROOT / "frontend" / "index.html").read_text(encoding="utf-8")]
    parts.extend(
        path.read_text(encoding="utf-8")
        for path in (ROOT / "frontend" / "src").rglob("*")
        if path.suffix in {".ts", ".tsx", ".css"}
    )
    return "\n".join(parts)


class ReactLegacyParityTests(unittest.TestCase):
    def test_legacy_static_selectors_are_preserved(self):
        legacy_html = (ROOT / "Hephaestus_UI" / "index.html").read_text(encoding="utf-8")
        legacy_js = (ROOT / "Hephaestus_UI" / "app.js").read_text(encoding="utf-8")
        react = react_sources()

        ids = set(re.findall(r'\bid="([^"]+)"', legacy_html))
        classes: set[str] = set()
        for value in re.findall(r'\bclass="([^"]+)"', legacy_html):
            classes.update(value.split())
        for value in re.findall(r'\.className\s*=\s*["`]([^"`]+)["`]', legacy_js):
            classes.update(value.split())
        for value in re.findall(r'\.classList\.add\(([^)]*)\)', legacy_js):
            classes.update(re.findall(r'["`]([^"`]+)["`]', value))
        for value in re.findall(r'querySelector(?:All)?\(["`]([^"`]+)["`]\)', legacy_js):
            classes.update(re.findall(r"\.([A-Za-z0-9_-]+)", value))

        self.assertEqual([], sorted(item for item in ids if item not in react))
        self.assertEqual([], sorted(item for item in classes if item not in react))

    def test_legacy_storage_contracts_are_preserved(self):
        react = react_sources()

        for key in ("hephaestus-chat-state-v1", "hephaestus-theme", "hephaestus-ui-scale-v1"):
            self.assertIn(key, react)
        self.assertIn("runtimeInfo", react)
        self.assertIn("prefers-color-scheme: dark", react)


if __name__ == "__main__":
    unittest.main()
