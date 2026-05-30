import pytest

from src.api.v1.calibration import provide_calibration_service
from src.config.settings import get_settings
from src.models.schemas.calibration import (
    AnonymousOutcomeDataset,
    AnonymousOutcomeRecord,
    CalibrationSummary,
)


class StubCalibrationService:
    async def record_outcome(self, payload):
        return AnonymousOutcomeRecord.model_validate(payload.model_dump())

    async def export_dataset(self):
        return AnonymousOutcomeDataset(
            exportedAt="2026-05-27T00:00:00Z",
            records=[],
        )

    async def summary(self):
        return CalibrationSummary(
            status="insufficient_sample_size",
            sampleSize=0,
            minimumSampleSize=30,
        )


@pytest.fixture(autouse=True)
def demo_auth_settings(app, monkeypatch):
    monkeypatch.setenv("FRONTMATTER_DEMO_AUTH_ENABLED", "true")
    monkeypatch.setenv("FRONTMATTER_DEMO_AUTH_USERNAME", "demo")
    monkeypatch.setenv("FRONTMATTER_DEMO_AUTH_PASSWORD", "secret-pass")
    monkeypatch.setenv("FRONTMATTER_DEMO_AUTH_SECRET", "super-secret-signing-key")
    monkeypatch.setenv("FRONTMATTER_DEMO_AUTH_COOKIE_NAME", "frontmatter_demo_session")
    get_settings.cache_clear()

    async def override_calibration_service():
        return StubCalibrationService()

    app.dependency_overrides[provide_calibration_service] = override_calibration_service
    yield
    get_settings.cache_clear()
    app.dependency_overrides.clear()


@pytest.mark.asyncio
async def test_calibration_export_requires_demo_auth(client):
    response = await client.get("/api/v1/calibration/export")

    assert response.status_code == 401


@pytest.mark.asyncio
async def test_authenticated_user_can_record_anonymous_outcome(client):
    await client.post(
        "/api/auth/login",
        json={"username": "demo", "password": "secret-pass"},
    )
    response = await client.post(
        "/api/v1/calibration/outcomes",
        json={
            "modelVersion": "dcf-v1",
            "businessType": "Cafe",
            "predictedNpv": 20000,
            "predictedMonthlyNetProfit": 3000,
            "predictedVerdict": "PROCEED TO DUE DILIGENCE",
            "actualMonthlyNetProfit": 2500,
            "actualOutcome": "operating_profitable",
        },
    )

    assert response.status_code == 200
    assert response.json()["businessType"] == "Cafe"
    assert "latitude" not in response.json()


@pytest.mark.asyncio
async def test_calibration_summary_reports_sample_gate(client):
    await client.post(
        "/api/auth/login",
        json={"username": "demo", "password": "secret-pass"},
    )
    response = await client.get("/api/v1/calibration/summary")

    assert response.status_code == 200
    assert response.json()["status"] == "insufficient_sample_size"
