from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

ActualOutcome = Literal[
    "operating_profitable",
    "operating_unprofitable",
    "abandoned_before_opening",
    "closed",
]


class AnonymousOutcomeRecord(BaseModel):
    model_config = ConfigDict(extra="forbid")

    modelVersion: str = Field(min_length=1, max_length=50)
    businessType: str = Field(min_length=1, max_length=100)
    predictedNpv: float
    predictedMonthlyNetProfit: float
    predictedVerdict: str = Field(min_length=1, max_length=100)
    actualMonthlyNetProfit: float
    actualOutcome: ActualOutcome


class OutcomeCreate(AnonymousOutcomeRecord):
    pass


class AnonymousOutcomeDataset(BaseModel):
    model_config = ConfigDict(extra="forbid")

    datasetVersion: Literal["anonymous-outcomes-v1"] = "anonymous-outcomes-v1"
    exportedAt: datetime
    records: list[AnonymousOutcomeRecord] = Field(default_factory=list)


class CalibrationSummary(BaseModel):
    status: Literal["insufficient_sample_size", "available"]
    sampleSize: int
    minimumSampleSize: int
    meanAbsoluteMonthlyProfitError: float | None = None
    meanMonthlyProfitError: float | None = None
    profitableOutcomeRate: float | None = None
