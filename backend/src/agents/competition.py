from collections.abc import AsyncGenerator
from typing import TYPE_CHECKING

from src.agents.base import BaseAgent
from src.models.schemas.intake import SpaceIntakeRequest
from src.models.schemas.map import MapData
from src.models.schemas.streaming import AgentLogEvent

if TYPE_CHECKING:
    from src.services.geo import GeoService
    from src.services.llm import LLMService


class CompetitionAgent(BaseAgent):
    """Looks up verified nearby businesses for the selected site."""

    def __init__(self, geo_service: "GeoService"):
        self._geo = geo_service

    @property
    def name(self) -> str:
        return "competition"

    @property
    def display_label(self) -> str:
        return "[Competition]"

    def build_prompt(self, intake: SpaceIntakeRequest) -> str:
        return ""

    def parse_response(self, raw_llm_output: str) -> dict:
        return {}

    def _unavailable_map(self, intake: SpaceIntakeRequest) -> dict:
        return {
            "mapData": {
                "center": [intake.latitude, intake.longitude],
                "locationMode": intake.location_mode,
                "siteLabel": intake.site_label,
                "dataSource": "google_places",
                "status": "unavailable",
                "searchRadiusMeters": 500,
                "competitors": [],
                "message": "Live nearby-place data is unavailable.",
            }
        }

    async def run(
        self, intake: SpaceIntakeRequest, llm_service: "LLMService"
    ) -> AsyncGenerator[AgentLogEvent, None]:
        yield self._make_log("Requesting live nearby-place data...")
        try:
            map_data = MapData.model_validate(await self._geo.nearby_map_data(intake))
            result = {"mapData": map_data.model_dump()}
            yield self._make_log("Verified nearby businesses mapped.")
        except Exception:
            result = self._unavailable_map(intake)
            yield self._make_log("Live nearby-place data unavailable; no simulated markers shown.")
        yield self._make_log("Competition lookup complete.", status="done")
        yield AgentLogEvent(
            agent=self.name,
            label=self.display_label,
            message="",
            status="done",
            data=result,
        )
