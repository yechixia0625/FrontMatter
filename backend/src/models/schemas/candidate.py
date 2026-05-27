from pydantic import BaseModel, Field

from src.models.schemas.benchmark import MarketBenchmarkBundle
from src.models.schemas.economics import LeaseEconomicsResult
from src.models.schemas.financial import FinancialModel
from src.models.schemas.map import MapData
from src.models.schemas.summary import Summary


class CandidateSiteInput(BaseModel):
    label: str = Field(min_length=1, max_length=250)
    monthlyRent: float = Field(gt=0)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class CandidateEvaluation(BaseModel):
    label: str
    monthlyRent: float
    latitude: float
    longitude: float
    summary: Summary
    financialModel: FinancialModel
    economicAnalysis: LeaseEconomicsResult
    marketBenchmarks: MarketBenchmarkBundle
    mapData: MapData
