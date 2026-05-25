from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.orm.analysis import AnalysisRecord
from src.repositories.base import BaseRepository


class AnalysisRepository(BaseRepository[AnalysisRecord]):
    """Repository for analysis records."""

    def __init__(self, session: AsyncSession):
        super().__init__(AnalysisRecord, session)

    async def get_latest(self) -> AnalysisRecord | None:
        result = await self.session.execute(
            select(AnalysisRecord)
            .order_by(AnalysisRecord.created_at.desc())
            .limit(1)
        )
        return result.scalar_one_or_none()

    async def update_status(self, record_id: int, status: str) -> AnalysisRecord | None:
        record = await self.get_by_id(record_id)
        if record:
            record.status = status
            await self.session.commit()
            await self.session.refresh(record)
        return record
