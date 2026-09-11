import pytest
from fastapi.testclient import TestClient

from app.main import create_app


@pytest.fixture()
def client(tmp_path):
    app = create_app(tmp_path / "tasks-test.sqlite")

    with TestClient(app) as test_client:
        yield test_client

