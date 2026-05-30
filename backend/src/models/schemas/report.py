from pydantic import BaseModel, Field

from src.models.schemas.benchmark import MarketBenchmarkBundle
from src.models.schemas.candidate import CandidateEvaluation
from src.models.schemas.economics import LeaseEconomicsResult
from src.models.schemas.financial import FinancialModel
from src.models.schemas.map import MapData
from src.models.schemas.recommendation import CandidateLocation
from src.models.schemas.spatial import SpatialBlueprint
from src.models.schemas.summary import Summary


class FrontMatterReport(BaseModel):
    """Root data contract - matches the spec JSON exactly."""

    summary: Summary
    spatialBlueprint: SpatialBlueprint
    financialModel: FinancialModel
    economicAnalysis: LeaseEconomicsResult
    marketBenchmarks: MarketBenchmarkBundle
    mapData: MapData
    candidateComparisons: list[CandidateEvaluation] = Field(default_factory=list)
    recommendedLocations: list[CandidateLocation] = Field(default_factory=list)
