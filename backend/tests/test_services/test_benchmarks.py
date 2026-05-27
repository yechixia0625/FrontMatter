from src.models.schemas.intake import SpaceIntakeRequest
from src.services.benchmarks import BenchmarkService


def make_intake(**overrides):
    payload = {
        "photo_bytes": b"\x89PNG\r\n\x1a\n",
        "photo_filename": "space.png",
        "photo_content_type": "image/png",
        "business_type": "Cafe",
        "expected_rent": 7000,
        "square_meters": 75,
        "location_mode": "address",
        "latitude": 1.3008,
        "longitude": 103.8591,
        "site_label": "21 Haji Lane, Singapore 189214",
    }
    payload.update(overrides)
    return SpaceIntakeRequest(**payload)


def test_snapshot_records_official_retail_rental_index_without_using_it_as_rent():
    benchmark = BenchmarkService().market_context(make_intake())

    retail_index = next(
        observation
        for observation in benchmark.observations
        if observation.key == "ura_retail_rental_index"
    )
    source = next(source for source in benchmark.sources if source.id == retail_index.sourceId)

    assert benchmark.retrievalMode == "snapshot"
    assert retail_index.value == 80.1
    assert retail_index.period == "2026-Q1"
    assert retail_index.usedInCashFlow is False
    assert source.publisher == "Urban Redevelopment Authority (URA)"
    assert "data.gov.sg" in source.url


def test_public_context_discloses_that_site_specific_rent_is_unavailable():
    benchmark = BenchmarkService().market_context(make_intake())

    site_rent = next(
        observation
        for observation in benchmark.observations
        if observation.key == "site_specific_market_rent"
    )

    assert benchmark.status == "context_available"
    assert site_rent.status == "reference_only"
    assert site_rent.value is None
    assert "not inferred" in benchmark.note.lower()
