import pytest

from src.app_factory import create_app
from src.config.settings import get_settings


@pytest.fixture(autouse=True)
def demo_auth_settings(monkeypatch):
    monkeypatch.setenv("FRONTMATTER_DEMO_AUTH_ENABLED", "true")
    monkeypatch.setenv("FRONTMATTER_DEMO_AUTH_USERNAME", "demo")
    monkeypatch.setenv("FRONTMATTER_DEMO_AUTH_PASSWORD", "secret-pass")
    monkeypatch.setenv("FRONTMATTER_DEMO_AUTH_SECRET", "super-secret-signing-key")
    monkeypatch.setenv("FRONTMATTER_DEMO_AUTH_COOKIE_NAME", "frontmatter_demo_session")
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.fixture
def app(demo_auth_settings):
    return create_app()


@pytest.mark.asyncio
async def test_login_sets_cookie(client):
    response = await client.post(
        "/api/auth/login",
        json={"username": "demo", "password": "secret-pass"},
    )

    assert response.status_code == 200
    assert response.json()["authenticated"] is True
    assert "set-cookie" in response.headers
    assert "frontmatter_demo_session=" in response.headers["set-cookie"]


@pytest.mark.asyncio
async def test_login_rejects_bad_password(client):
    response = await client.post(
        "/api/auth/login",
        json={"username": "demo", "password": "wrong"},
    )

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_session_reports_authenticated(client):
    await client.post(
        "/api/auth/login",
        json={"username": "demo", "password": "secret-pass"},
    )

    response = await client.get("/api/auth/session")

    assert response.status_code == 200
    assert response.json()["authenticated"] is True
    assert response.json()["username"] == "demo"


@pytest.mark.asyncio
async def test_session_reports_unauthenticated_without_cookie(client):
    response = await client.get("/api/auth/session")

    assert response.status_code == 200
    assert response.json() == {
        "authenticated": False,
        "username": None,
        "authEnabled": True,
    }


@pytest.mark.asyncio
async def test_saved_reports_require_demo_auth(client):
    response = await client.get("/api/v1/reports/1")

    assert response.status_code == 401
