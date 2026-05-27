import pytest
from pydantic import ValidationError

from src.models.schemas.calibration import (
    AnonymousOutcomeDataset,
    AnonymousOutcomeRecord,
)
from src.services.calibration import (
    MIN_CALIBRATION_SAMPLE_SIZE,
    calculate_calibration_summary,
    export_anonymous_dataset,
)


def make_record(**overrides) -> AnonymousOutcomeRecord:
    payload = {
        "modelVersion": "dcf-v1",
        "businessType": "Cafe",
        "predictedNpv": 55_000,
        "predictedMonthlyNetProfit": 6000,
        "predictedVerdict": "PROCEED TO DUE DILIGENCE",
        "actualMonthlyNetProfit": 5000,
        "actualOutcome": "operating_profitable",
    }
    payload.update(overrides)
    return AnonymousOutcomeRecord(**payload)


def test_anonymous_dataset_excludes_sensitive_location_and_image_fields():
    dataset = export_anonymous_dataset([make_record()])
    payload = dataset.model_dump()

    assert "latitude" not in str(payload).lower()
    assert "site" not in str(payload).lower()
    assert "photo" not in str(payload).lower()
    assert payload["records"][0]["businessType"] == "Cafe"


def test_import_schema_rejects_unknown_sensitive_fields():
    with pytest.raises(ValidationError):
        AnonymousOutcomeDataset.model_validate(
            {
                "datasetVersion": "anonymous-outcomes-v1",
                "exportedAt": "2026-05-27T00:00:00Z",
                "records": [
                    {
                        **make_record().model_dump(),
                        "latitude": 1.3,
                    }
                ],
            }
        )


def test_calibration_statistics_are_gated_until_minimum_sample_count():
    summary = calculate_calibration_summary([make_record()])

    assert summary.status == "insufficient_sample_size"
    assert summary.minimumSampleSize == MIN_CALIBRATION_SAMPLE_SIZE
    assert summary.meanAbsoluteMonthlyProfitError is None


def test_calibration_reports_error_metrics_when_sample_is_sufficient():
    records = [make_record(actualMonthlyNetProfit=5500) for _ in range(30)]

    summary = calculate_calibration_summary(records)

    assert summary.status == "available"
    assert summary.sampleSize == 30
    assert summary.meanAbsoluteMonthlyProfitError == 500
    assert summary.profitableOutcomeRate == 1.0
