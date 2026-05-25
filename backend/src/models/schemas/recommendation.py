from typing import Literal

from pydantic import BaseModel, Field


class SourceLink(BaseModel):
    label: str
    url: str


class CandidateLocation(BaseModel):
    name: str
    address: str
    country: Literal["Singapore"] = "Singapore"
    area: str
    lat: float
    lng: float
    score: int = Field(ge=0, le=100)
    rentBenchmark: str
    estimatedMonthlyRent: float
    nearbySignals: list[str]
    pros: list[str]
    cons: list[str]
    sourceLinks: list[SourceLink]
