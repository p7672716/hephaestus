from pathlib import Path
import tempfile
import unittest

from fastapi import Response

from hephaestus_server.auth import AuthManager, COOKIE_NAME


class DummyClient:
    def __init__(self, host: str) -> None:
        self.host = host


class DummyRequest:
    def __init__(self, host: str, cookies=None, headers=None) -> None:
        self.client = DummyClient(host)
        self.cookies = cookies or {}
        self.headers = headers or {}


class AuthTests(unittest.TestCase):
    def test_remote_requires_token_then_trusted_cookie(self):
        with tempfile.TemporaryDirectory() as tmp:
            auth = AuthManager(Path(tmp))
            remote = DummyRequest("203.0.113.10")
            local = DummyRequest("127.0.0.1")
            token = auth.status(local)["token"]

            self.assertFalse(auth.authenticated(remote))
            self.assertTrue(auth.authenticated(DummyRequest("203.0.113.10", headers={"authorization": f"Bearer {token}"})))

            response = Response()
            device = auth.trust(response)
            self.assertTrue(auth.authenticated(DummyRequest("203.0.113.10", cookies={COOKIE_NAME: device})))


if __name__ == "__main__":
    unittest.main()
