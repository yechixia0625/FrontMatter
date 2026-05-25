from abc import ABC, abstractmethod
from collections.abc import AsyncGenerator
from typing import TYPE_CHECKING

from src.models.schemas.intake import SpaceIntakeRequest
from src.models.schemas.streaming import AgentLogEvent, AgentStatus

if TYPE_CHECKING:
    from src.services.llm import LLMService


class BaseAgent(ABC):
    """
    Abstract base for all 4 AI agents.

    Contract:
      1. Receives the raw intake data
      2. Calls the LLM with a specialized prompt
      3. Yields structured log events as it works
      4. Returns a partial report fragment upon completion
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Agent identifier, e.g. 'spatial'."""
        ...

    @property
    @abstractmethod
    def display_label(self) -> str:
        """Terminal display label, e.g. '[Spatial]'."""
        ...

    @abstractmethod
    async def run(
        self,
        intake: SpaceIntakeRequest,
        llm_service: "LLMService",
    ) -> AsyncGenerator[AgentLogEvent, None]:
        """
        Execute the agent's analysis.
        Yields AgentLogEvent instances for real-time SSE streaming.
        The final yield carries the agent's partial report data via the data field.
        """
        ...

    @abstractmethod
    def build_prompt(self, intake: SpaceIntakeRequest) -> str:
        """Construct the LLM prompt for this agent's domain."""
        ...

    @abstractmethod
    def parse_response(self, raw_llm_output: str) -> dict:
        """Parse and validate the LLM response into a structured dict."""
        ...

    def _make_log(self, message: str, status: AgentStatus = "running") -> AgentLogEvent:
        """Helper to create a log event for this agent."""
        return AgentLogEvent(
            agent=self.name,
            label=self.display_label,
            message=message,
            status=status,
        )
