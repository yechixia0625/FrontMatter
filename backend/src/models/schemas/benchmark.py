from typing import Literal

from pydantic import BaseModel


class BenchmarkSource(BaseModel):
    id: str
    publisher: str
    title: str
    url: str
    licence: str
    accessedDate: str
    dataUpdatedDate: str | None = None


class BenchmarkObservation(BaseModel):
    key: str
    label: str
    value: float | None = None
    unit: str
    period: str | None = None
    geography: str
    status: Literal["observed", "reference_only", "unavailable"]
    sourceId: str
    usedInCashFlow: bool = False
    note: str | None = None


class MarketBenchmarkBundle(BaseModel):
    status: Literal["context_available", "unavailable"]
    retrievalMode: Literal["snapshot", "live"]
    snapshotVersion: str
    sources: list[BenchmarkSource]
    observations: list[BenchmarkObservation]
    note: str
