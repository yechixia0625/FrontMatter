from datetime import UTC, datetime

from src.models.orm.outcome import OutcomeRecord
from src.models.schemas.calibration import (
    AnonymousOutcomeDataset,
    AnonymousOutcomeRecord,
    CalibrationSummary,
    OutcomeCreate,
)
from src.repositories.outcome import OutcomeRepository

MIN_CALIBRATION_SAMPLE_SIZE = 30


def export_anonymous_dataset(
    outcomes: list[AnonymousOutcomeRecord],
) -> AnonymousOutcomeDataset:
    return AnonymousOutcomeDataset(
        exportedAt=datetime.now(UTC),
        records=outcomes,
    )


def calculate_calibration_summary(
    outcomes: list[AnonymousOutcomeRecord],
) -> CalibrationSummary:
    sample_size = len(outcomes)
    if sample_size < MIN_CALIBRATION_SAMPLE_SIZE:
        return CalibrationSummary(
            status="insufficient_sample_size",
            sampleSize=sample_size,
            minimumSampleSize=MIN_CALIBRATION_SAMPLE_SIZE,
        )
    errors = [
        outcome.actualMonthlyNetProfit - outcome.predictedMonthlyNetProfit
        for outcome in outcomes
    ]
    profitable_count = sum(
        outcome.actualOutcome == "operating_profitable" for outcome in outcomes
    )
    return CalibrationSummary(
        status="available",
        sampleSize=sample_size,
        minimumSampleSize=MIN_CALIBRATION_SAMPLE_SIZE,
        meanAbsoluteMonthlyProfitError=round(
            sum(abs(error) for error in errors) / sample_size, 2
        ),
        meanMonthlyProfitError=round(sum(errors) / sample_size, 2),
        profitableOutcomeRate=round(profitable_count / sample_size, 4),
    )


class CalibrationService:
    def __init__(self, repository: OutcomeRepository):
        self._repository = repository

    async def record_outcome(self, payload: OutcomeCreate) -> AnonymousOutcomeRecord:
        record = await self._repository.create(_to_orm(payload, origin="local"))
        return _to_anonymous(record)

    async def export_dataset(self) -> AnonymousOutcomeDataset:
        records = await self._repository.list_(limit=10_000)
        return export_anonymous_dataset([_to_anonymous(record) for record in records])

    async def import_dataset(
        self, dataset: AnonymousOutcomeDataset
    ) -> AnonymousOutcomeDataset:
        imported: list[AnonymousOutcomeRecord] = []
        for outcome in dataset.records:
            record = await self._repository.create(_to_orm(outcome, origin="imported"))
            imported.append(_to_anonymous(record))
        return export_anonymous_dataset(imported)

    async def summary(self) -> CalibrationSummary:
        records = await self._repository.list_(limit=10_000)
        return calculate_calibration_summary([_to_anonymous(record) for record in records])


def _to_orm(payload: AnonymousOutcomeRecord, *, origin: str) -> OutcomeRecord:
    return OutcomeRecord(
        model_version=payload.modelVersion,
        business_type=payload.businessType,
        predicted_npv=payload.predictedNpv,
        predicted_monthly_net_profit=payload.predictedMonthlyNetProfit,
        predicted_verdict=payload.predictedVerdict,
        actual_monthly_net_profit=payload.actualMonthlyNetProfit,
        actual_outcome=payload.actualOutcome,
        origin=origin,
    )


def _to_anonymous(record: OutcomeRecord) -> AnonymousOutcomeRecord:
    return AnonymousOutcomeRecord(
        modelVersion=record.model_version,
        businessType=record.business_type,
        predictedNpv=record.predicted_npv,
        predictedMonthlyNetProfit=record.predicted_monthly_net_profit,
        predictedVerdict=record.predicted_verdict,
        actualMonthlyNetProfit=record.actual_monthly_net_profit,
        actualOutcome=record.actual_outcome,
    )
