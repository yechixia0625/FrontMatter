from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.models.orm.report import ReportSnapshot
from src.repositories.base import BaseRepository


class ReportRepository(BaseRepository[ReportSnapshot]):
    """Repository for report snapshots."""

    def __init__(self, session: AsyncSession):
        super().__init__(ReportSnapshot, session)

    async def get_by_analysis_id(self, analysis_id: int) -> ReportSnapshot | None:
        result = await self.session.execute(
            select(ReportSnapshot).where(ReportSnapshot.analysis_id == analysis_id)
        )
        return result.scalar_one_or_none()
