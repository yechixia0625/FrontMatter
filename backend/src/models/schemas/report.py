from pydantic import BaseModel, Field

from src.models.schemas.financial import FinancialModel
from src.models.schemas.map import MapData
from src.models.schemas.recommendation import CandidateLocation
from src.models.schemas.spatial import SpatialBlueprint
from src.models.schemas.summary import Summary


class LeaseLensReport(BaseModel):
    """Root data contract - matches the spec JSON exactly."""

    summary: Summary
    spatialBlueprint: SpatialBlueprint
    financialModel: FinancialModel
    mapData: MapData
    recommendedLocations: list[CandidateLocation] = Field(default_factory=list)
