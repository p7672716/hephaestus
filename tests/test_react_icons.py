from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


class ReactIconParityTests(unittest.TestCase):
    def test_legacy_button_icons_exist_in_react(self):
        legacy = (ROOT / "Hephaestus_UI" / "app.js").read_text(encoding="utf-8")
        legacy_block = legacy[legacy.find("const icons = {"):legacy.find("};", legacy.find("const icons = {"))]
        legacy_icons = set(re.findall(r"\n\s*(\w+):\s*'<svg", legacy_block))

        react = (ROOT / "frontend" / "src" / "components" / "Icon.tsx").read_text(encoding="utf-8")
        react_icons = set(re.findall(r"\| '([^']+)'", react))

        self.assertFalse(legacy_icons - react_icons)

    def test_react_app_icon_metadata_is_present(self):
        index = (ROOT / "frontend" / "index.html").read_text(encoding="utf-8")
        manifest = (ROOT / "frontend" / "public" / "manifest.webmanifest").read_text(encoding="utf-8")

        self.assertIn("/assets/hephaestus-icon.svg", index)
        self.assertIn("/assets/hephaestus-icon.png", index)
        self.assertIn("apple-touch-icon", index)
        self.assertIn("manifest.webmanifest", index)
        self.assertIn("/assets/hephaestus-icon.svg", manifest)
        self.assertIn("/assets/hephaestus-icon.png", manifest)


if __name__ == "__main__":
    unittest.main()
