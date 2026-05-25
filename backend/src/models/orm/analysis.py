from sqlalchemy.orm import Mapped, mapped_column

from src.models.orm.base import Base, TimestampMixin


class AnalysisRecord(TimestampMixin, Base):
    __tablename__ = "analyses"

    id: Mapped[int] = mapped_column(primary_key=True)
    business_type: Mapped[str]
    expected_rent: Mapped[float]
    square_meters: Mapped[float]
    photo_path: Mapped[str | None] = mapped_column(nullable=True)
    status: Mapped[str] = mapped_column(default="pending")
