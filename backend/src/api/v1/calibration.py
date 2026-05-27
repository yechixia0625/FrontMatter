from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.deps import provide_db_session, require_demo_auth
from src.models.schemas.calibration import (
    AnonymousOutcomeDataset,
    AnonymousOutcomeRecord,
    CalibrationSummary,
    OutcomeCreate,
)
from src.repositories.outcome import OutcomeRepository
from src.services.calibration import CalibrationService

router = APIRouter(prefix="/calibration", tags=["calibration"])


async def provide_calibration_service(
    session: AsyncSession = Depends(provide_db_session),
) -> CalibrationService:
    return CalibrationService(OutcomeRepository(session))


@router.post("/outcomes", response_model=AnonymousOutcomeRecord)
async def record_outcome(
    payload: OutcomeCreate,
    _username: str | None = Depends(require_demo_auth),
    service: CalibrationService = Depends(provide_calibration_service),
):
    return await service.record_outcome(payload)


@router.get("/export", response_model=AnonymousOutcomeDataset)
async def export_dataset(
    _username: str | None = Depends(require_demo_auth),
    service: CalibrationService = Depends(provide_calibration_service),
):
    return await service.export_dataset()


@router.post("/import", response_model=AnonymousOutcomeDataset)
async def import_dataset(
    dataset: AnonymousOutcomeDataset,
    _username: str | None = Depends(require_demo_auth),
    service: CalibrationService = Depends(provide_calibration_service),
):
    return await service.import_dataset(dataset)


@router.get("/summary", response_model=CalibrationSummary)
async def calibration_summary(
    _username: str | None = Depends(require_demo_auth),
    service: CalibrationService = Depends(provide_calibration_service),
):
    return await service.summary()
