import os
import importlib

import pytest

fastapi = pytest.importorskip("fastapi")
HTTPException = fastapi.HTTPException


@pytest.fixture(scope="module")
def server_module():
    os.environ.setdefault("API_KEY", "test-api-key")
    os.environ.setdefault("MONGO_URL", "mongodb://localhost:27017")
    os.environ.setdefault("DB_NAME", "test_db")
    os.environ.setdefault("ENCRYPTION_KEY", "MDEyMzQ1Njc4OWFiY2RlZjAxMjM0NTY3ODlhYmNkZWY=")
    os.environ.setdefault("CORS_ORIGINS", "http://localhost:3000")
    return importlib.import_module("backend.server")


def test_resolve_workspace_path_allows_nested_file(server_module, tmp_path):
    root = tmp_path / "workspace"
    root.mkdir()
    safe = server_module.resolve_workspace_path(str(root), "src/main.py")
    assert safe.startswith(str(root))


def test_resolve_workspace_path_blocks_traversal(server_module, tmp_path):
    root = tmp_path / "workspace"
    root.mkdir()
    with pytest.raises(HTTPException) as exc:
        server_module.resolve_workspace_path(str(root), "../outside.txt")
    assert exc.value.status_code == 400


def test_require_api_key_rejects_invalid_key(server_module):
    with pytest.raises(HTTPException) as exc:
        server_module.require_api_key("wrong-key")
    assert exc.value.status_code == 401


def test_require_api_key_accepts_valid_key(server_module):
    assert server_module.require_api_key("test-api-key") is None
