from src.exceptions.base import FrontMatterError


class AgentError(FrontMatterError):
    """Base agent execution error."""

    def __init__(self, agent_name: str, message: str = "", **kwargs):
        self.agent_name = agent_name
        super().__init__(message=f"[{agent_name}] {message}", **kwargs)


class AgentTimeoutError(AgentError):
    """Agent exceeded execution deadline."""


class AgentLLMError(AgentError):
    """LLM call failed within an agent."""
