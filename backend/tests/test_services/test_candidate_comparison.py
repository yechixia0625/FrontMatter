import pytest

from src.models.schemas.candidate import CandidateSiteInput
from src.models.schemas.intake import SpaceIntakeRequest
from src.services.benchmarks import BenchmarkService
from src.services.candidate_comparison import compare_candidates


class FakeGeo:
    async def nearby_map_data(self, intake):
        return {
            "center": [intake.latitude, intake.longitude],
            "locationMode": intake.location_mode,
            "siteLabel": intake.site_label,
            "dataSource": "google_places",
            "status": "available",
            "searchRadiusMeters": 500,
            "competitors": [],
        }


def make_intake() -> SpaceIntakeRequest:
    return SpaceIntakeRequest(
        photo_bytes=b"\x89PNG\r\n\x1a\n",
        photo_filename="space.png",
        photo_content_type="image/png",
        business_type="Cafe",
        expected_rent=5000,
        square_meters=70,
        lease_term_months=36,
        expected_daily_customers=180,
        average_spend=18,
        gross_margin=0.68,
        fitout_budget=50_000,
        staffing_monthly=8000,
        utilities_monthly_estimate=800,
        location_mode="address",
        latitude=1.30,
        longitude=103.85,
        site_label="Base site",
    )


@pytest.mark.asyncio
async def test_empty_candidates_do_not_generate_comparisons():
    results = await compare_candidates(make_intake(), [], FakeGeo(), BenchmarkService())

    assert results == []


@pytest.mark.asyncio
async def test_submitted_candidates_are_evaluated_with_their_stated_rents():
    candidates = [
        CandidateSiteInput(
            label="Lower rent site", monthlyRent=4000, latitude=1.301, longitude=103.851
        ),
        CandidateSiteInput(
            label="Higher rent site", monthlyRent=9000, latitude=1.302, longitude=103.852
        ),
    ]

    results = await compare_candidates(make_intake(), candidates, FakeGeo(), BenchmarkService())

    assert [result.label for result in results] == ["Lower rent site", "Higher rent site"]
    assert results[0].financialModel.baseRent == 4000
    assert results[0].economicAnalysis.npv > results[1].economicAnalysis.npv
