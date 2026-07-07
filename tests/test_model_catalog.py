import unittest

from hephaestus_server.model_catalog import MODEL_CATALOG, route_model


class ModelCatalogTests(unittest.TestCase):
    def test_models_are_fixed(self):
        self.assertIn("agents-a1", MODEL_CATALOG)
        self.assertIn("ornith", MODEL_CATALOG)

    def test_manual_selection_wins(self):
        route = route_model("agents-a1", "fix this bug", "coding")
        self.assertEqual(route["model_id"], "agents-a1")
        self.assertEqual(route["route_reason"], "manual selection")

    def test_auto_routes_coding_to_ornith(self):
        route = route_model("auto", "このエラーを修正してテストして", "chat")
        self.assertEqual(route["model_id"], "ornith")
        self.assertEqual(route["task_kind"], "coding")

    def test_auto_routes_research_to_agents(self):
        route = route_model("auto", "方針を整理して", "chat")
        self.assertEqual(route["model_id"], "agents-a1")
        self.assertEqual(route["task_kind"], "analysis")


if __name__ == "__main__":
    unittest.main()
