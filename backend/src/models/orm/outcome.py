from sqlalchemy.orm import Mapped, mapped_column

from src.models.orm.base import Base, TimestampMixin


class OutcomeRecord(TimestampMixin, Base):
    __tablename__ = "outcomes"

    id: Mapped[int] = mapped_column(primary_key=True)
    model_version: Mapped[str]
    business_type: Mapped[str]
    predicted_npv: Mapped[float]
    predicted_monthly_net_profit: Mapped[float]
    predicted_verdict: Mapped[str]
    actual_monthly_net_profit: Mapped[float]
    actual_outcome: Mapped[str]
    origin: Mapped[str] = mapped_column(default="local")
