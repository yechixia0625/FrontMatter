import httpx
import pytest

from src.config.settings import Settings
from src.models.schemas.intake import SpaceIntakeRequest
from src.services.geo import GeoService


@pytest.mark.asyncio
async def test_nearby_places_uses_pro_fields_and_derives_proximity_level():
    captured = {}

    async def handler(request: httpx.Request) -> httpx.Response:
        captured["headers"] = request.headers
        return httpx.Response(
            200,
            json={
                "places": [
                    {
                        "displayName": {"text": "Verified Cafe"},
                        "location": {"latitude": 31.2314, "longitude": 121.4737},
                        "primaryType": "cafe",
                    }
                ]
            },
        )

    service = GeoService(
        Settings(_env_file=None, google_places_api_key="test-google-places-key"),
        client=httpx.AsyncClient(transport=httpx.MockTransport(handler)),
    )
    intake = SpaceIntakeRequest(
        photo_bytes=b"png",
        photo_content_type="image/png",
        business_type="Cafe",
        expected_rent=5200,
        square_meters=80,
        location_mode="address",
        latitude=31.2304,
        longitude=121.4737,
        site_label="Selected Retail Site",
    )

    result = await service.nearby_map_data(intake)
    await service.close()

    assert captured["headers"]["X-Goog-FieldMask"] == (
        "places.displayName,places.location,places.primaryType"
    )
    assert result["competitors"][0]["name"] == "Verified Cafe"
    assert result["competitors"][0]["distanceMeters"] > 0
    assert result["competitors"][0]["proximityLevel"] == "HIGH"
    assert "threatLevel" not in result["competitors"][0]


@pytest.mark.asyncio
async def test_placeholder_places_key_is_treated_as_unconfigured():
    service = GeoService(
        Settings(_env_file=None, google_places_api_key="replace-with-google-places-api-key")
    )

    with pytest.raises(RuntimeError, match="Google Places API is not configured"):
        await service.autocomplete("Tanjong Pagar", "session-token-1")

    await service.close()


@pytest.mark.asyncio
async def test_autocomplete_is_restricted_to_singapore():
    captured = {}

    async def handler(request: httpx.Request) -> httpx.Response:
        captured["body"] = request.content.decode()
        return httpx.Response(200, json={"suggestions": []})

    service = GeoService(
        Settings(_env_file=None, google_places_api_key="test-google-places-key"),
        client=httpx.AsyncClient(transport=httpx.MockTransport(handler)),
    )

    await service.autocomplete("Marina", "session-token-1")
    await service.close()

    assert '"includedRegionCodes":["SG"]' in captured["body"]
    assert '"regionCode":"SG"' in captured["body"]


@pytest.mark.asyncio
async def test_resolve_rejects_locations_outside_singapore():
    async def handler(_: httpx.Request) -> httpx.Response:
        return httpx.Response(
            200,
            json={
                "formattedAddress": "Shanghai",
                "location": {"latitude": 31.2304, "longitude": 121.4737},
            },
        )

    service = GeoService(
        Settings(_env_file=None, google_places_api_key="test-google-places-key"),
        client=httpx.AsyncClient(transport=httpx.MockTransport(handler)),
    )

    with pytest.raises(ValueError, match="outside the supported Singapore service area"):
        await service.resolve("place-1", "session-token-1")

    await service.close()
