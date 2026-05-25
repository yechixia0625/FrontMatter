import asyncio
from collections.abc import AsyncGenerator

from src.agents import get_all_agents
from src.agents.base import BaseAgent
from src.models.schemas.intake import SpaceIntakeRequest
from src.models.schemas.report import LeaseLensReport
from src.models.schemas.streaming import AgentLogEvent, ErrorEvent
from src.pipeline.stream import SSEStreamManager
from src.services.geo import GeoService
from src.services.llm import LLMService
from src.services.scoring import enrich_summary, recommend_locations


class AnalysisOrchestrator:
    """
    Runs 4 agents concurrently via asyncio.gather.
    Collects their partial results and assembles the final LeaseLensReport.
    """

    def __init__(self, llm_service: LLMService, geo_service: GeoService):
        self._llm = llm_service
        self._agents = get_all_agents(geo_service)

    async def run(self, intake: SpaceIntakeRequest) -> AsyncGenerator[str, None]:
        """
        Main entry point. Yields SSE-formatted strings:
          - agent_log events during processing
          - final unnamed data frame with the complete LeaseLensReport
        """
        stream = SSEStreamManager()

        producer_task = asyncio.create_task(self._run_agents(intake, stream))

        async for sse_line in self._collect_events(stream):
            yield sse_line

        results = await producer_task
        failures = [result for result in results if isinstance(result, BaseException)]
        if failures:
            error_event = ErrorEvent(message="Analysis failed before a report was produced.")
            yield SSEStreamManager.format_sse("error", error_event.model_dump())
            return

        final_report = self._assemble_report(results, intake)
        yield SSEStreamManager.format_data(final_report.model_dump())

    async def _run_agents(
        self, intake: SpaceIntakeRequest, stream: SSEStreamManager
    ) -> list[dict | BaseException]:
        """Run all agents concurrently and close logs after every producer exits."""
        agent_tasks = [
            asyncio.create_task(self._run_single_agent(agent, intake, stream))
            for agent in self._agents
        ]
        try:
            return await asyncio.gather(*agent_tasks, return_exceptions=True)
        finally:
            await stream.close()

    async def _collect_events(
        self, stream: SSEStreamManager
    ) -> AsyncGenerator[str, None]:
        """Read events from the stream queue and yield SSE-formatted strings."""
        while True:
            event = await stream.read()
            if event is None:
                break
            yield SSEStreamManager.format_sse(
                "agent_log", event.model_dump(exclude_none=True)
            )

    async def _run_single_agent(
        self,
        agent: BaseAgent,
        intake: SpaceIntakeRequest,
        stream: SSEStreamManager,
    ) -> dict:
        """Run a single agent and push its events to the stream."""
        partial_data: dict = {}
        try:
            async for log_event in agent.run(intake, self._llm):
                await stream.emit(log_event)
                if log_event.status == "done" and log_event.data:
                    partial_data = log_event.data
        except Exception as e:
            error_event = AgentLogEvent(
                agent=agent.name,
                label=agent.display_label,
                message=str(e),
                status="error",
            )
            await stream.emit(error_event)
            raise
        return partial_data

    def _assemble_report(
        self, results: list[dict | BaseException], intake: SpaceIntakeRequest
    ) -> LeaseLensReport:
        """Merge all agent partial outputs into the final LeaseLensReport."""
        merged: dict = {}
        for r in results:
            if isinstance(r, dict):
                merged.update(r)

        # Ensure all required sections exist with defaults
        if "spatialBlueprint" not in merged:
            merged["spatialBlueprint"] = {
                "aspectRatio": 1.5,
                "elements": [],
                "heatZones": [],
            }
        if "financialModel" not in merged:
            merged["financialModel"] = {
                "baseRent": intake.expected_rent,
                "expectedTraffic": 100,
                "conversionRate": 0.05,
                "averageSpend": 30,
                "grossMargin": 0.6,
                "fixedCostNonRent": 2000,
                "initialDecorationCost": 30000,
            }
        if "mapData" not in merged:
            merged["mapData"] = {
                "center": [intake.latitude, intake.longitude],
                "locationMode": intake.location_mode,
                "siteLabel": intake.site_label,
                "dataSource": "google_places",
                "status": "unavailable",
                "searchRadiusMeters": 500,
                "competitors": [],
                "message": "Live nearby-place data is unavailable.",
            }
        if "summary" not in merged:
            merged["summary"] = {
                "score": 70,
                "verdict": "APPROVED WITH CONDITIONS",
                "paybackMonths": 12.0,
            }

        merged["summary"] = enrich_summary(
            intake,
            merged["financialModel"],
            merged["mapData"],
            merged["summary"],
        )
        merged["recommendedLocations"] = recommend_locations(
            intake,
            merged["mapData"],
            merged["summary"],
        )

        return LeaseLensReport(**merged)
