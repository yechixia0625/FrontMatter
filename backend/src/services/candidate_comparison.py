from src.models.schemas.candidate import CandidateEvaluation, CandidateSiteInput
from src.models.schemas.intake import SpaceIntakeRequest
from src.models.schemas.map import MapData
from src.services.benchmarks import BenchmarkService
from src.services.scoring import build_economic_analysis, enrich_summary


async def compare_candidates(
    intake: SpaceIntakeRequest,
    candidates: list[CandidateSiteInput],
    geo_service,
    benchmark_service: BenchmarkService,
) -> list[CandidateEvaluation]:
    """Evaluate only explicit user-selected sites under common operating assumptions."""
    results: list[CandidateEvaluation] = []
    for candidate in candidates:
        candidate_intake = intake.model_copy(
            update={
                "expected_rent": candidate.monthlyRent,
                "location_mode": "address",
                "latitude": candidate.latitude,
                "longitude": candidate.longitude,
                "site_label": candidate.label,
                "candidate_sites": [],
            }
        )
        map_data = await _map_data(candidate_intake, geo_service)
        financial_model: dict = {"estimateStatus": "benchmark"}
        economics = build_economic_analysis(candidate_intake, financial_model)
        summary = enrich_summary(
            candidate_intake,
            financial_model,
            map_data,
            {},
            economics=economics,
        )
        results.append(
            CandidateEvaluation(
                label=candidate.label,
                monthlyRent=candidate.monthlyRent,
                latitude=candidate.latitude,
                longitude=candidate.longitude,
                summary=summary,
                financialModel=financial_model,
                economicAnalysis=economics,
                marketBenchmarks=benchmark_service.market_context(candidate_intake),
                mapData=map_data,
            )
        )
    return results


async def _map_data(intake: SpaceIntakeRequest, geo_service) -> dict:
    try:
        return MapData.model_validate(await geo_service.nearby_map_data(intake)).model_dump()
    except Exception:
        return {
            "center": [intake.latitude, intake.longitude],
            "locationMode": intake.location_mode,
            "siteLabel": intake.site_label,
            "dataSource": "google_places",
            "status": "unavailable",
            "searchRadiusMeters": 500,
            "competitors": [],
            "message": "Live nearby-place data is unavailable.",
        }
