import pytest
from httpx import ASGITransport, AsyncClient

from src.app_factory import create_app
from src.config.settings import get_settings


@pytest.fixture
def isolated_settings(monkeypatch):
    monkeypatch.setenv("LEASENS_DEMO_AUTH_ENABLED", "false")
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.fixture
def app(isolated_settings):
    return create_app()


@pytest.fixture
async def client(app):
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://testserver"
    ) as test_client:
        yield test_client
