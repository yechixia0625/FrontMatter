from typing import TYPE_CHECKING

from src.agents.base import BaseAgent
from src.agents.competition import CompetitionAgent
from src.agents.finance import FinanceAgent
from src.agents.spatial import SpatialAgent
from src.agents.strategy import StrategyAgent

if TYPE_CHECKING:
    from src.services.geo import GeoService


def get_all_agents(geo_service: "GeoService") -> list[BaseAgent]:
    """Instantiate all registered agents."""
    return [SpatialAgent(), FinanceAgent(), CompetitionAgent(geo_service), StrategyAgent()]


__all__ = [
    "BaseAgent",
    "SpatialAgent",
    "FinanceAgent",
    "CompetitionAgent",
    "StrategyAgent",
    "get_all_agents",
]
