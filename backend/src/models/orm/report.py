from sqlalchemy import JSON, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column

from src.models.orm.base import Base, TimestampMixin


class ReportSnapshot(TimestampMixin, Base):
    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True)
    analysis_id: Mapped[int] = mapped_column(ForeignKey("analyses.id"), index=True)
    report_json: Mapped[dict] = mapped_column(JSON)
    score: Mapped[int]
    verdict: Mapped[str]
