import pytest

from src.agents.spatial import SpatialAgent
from src.models.schemas.intake import SpaceIntakeRequest


class CaptureLLM:
    def __init__(self):
        self.kwargs = None

    async def complete(self, prompt, **kwargs):
        self.kwargs = kwargs
        return '{"spatialBlueprint":{"aspectRatio":1.5,"elements":[],"heatZones":[]}}'


@pytest.fixture
def intake_with_png():
    return SpaceIntakeRequest(
        photo_bytes=b"\x89PNG\r\n\x1a\n",
        photo_filename="space.png",
        photo_content_type="image/png",
        business_type="Cafe",
        expected_rent=5200,
        square_meters=80,
        location_mode="current",
        latitude=31.2304,
        longitude=121.4737,
    )


@pytest.mark.asyncio
async def test_spatial_agent_supplies_uploaded_image_to_llm(intake_with_png):
    llm = CaptureLLM()
    _ = [event async for event in SpatialAgent().run(intake_with_png, llm)]

    assert llm.kwargs["image_bytes"] == intake_with_png.photo_bytes
    assert llm.kwargs["image_content_type"] == "image/png"


def test_spatial_invalid_fragment_uses_valid_fallback():
    result = SpatialAgent().parse_response('{"spatialBlueprint":{"bad":true}}')

    assert result["spatialBlueprint"]["elements"][0]["type"] == "door"
    assert result["spatialBlueprint"]["heatZones"][0]["type"] == "high_visibility"
    assert len(result["spatialBlueprint"]["flowPath"]) >= 2
    assert result["spatialBlueprint"]["zoneInsights"][0]["reason"]
