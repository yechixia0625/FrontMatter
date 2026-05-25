from collections.abc import AsyncGenerator

from src.models.schemas.intake import SpaceIntakeRequest
from src.pipeline.orchestrator import AnalysisOrchestrator
from src.repositories.analysis import AnalysisRepository
from src.repositories.report import ReportRepository


class AnalysisService:
    """Orchestrates the full analysis pipeline and persists results."""

    def __init__(
        self,
        orchestrator: AnalysisOrchestrator,
        report_repo: ReportRepository,
        analysis_repo: AnalysisRepository,
    ):
        self._orchestrator = orchestrator
        self._report_repo = report_repo
        self._analysis_repo = analysis_repo

    async def analyze(self, intake: SpaceIntakeRequest) -> AsyncGenerator[str, None]:
        """Run analysis, yielding SSE-formatted strings."""
        async for sse_chunk in self._orchestrator.run(intake):
            yield sse_chunk
