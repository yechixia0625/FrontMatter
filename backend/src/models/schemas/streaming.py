from typing import Any, Literal

from pydantic import BaseModel

AgentStatus = Literal["running", "done", "error"]


class AgentLogEvent(BaseModel):
    """Single SSE event payload for one agent log line."""

    event: Literal["agent_log"] = "agent_log"
    agent: str
    label: str
    message: str
    status: AgentStatus = "running"
    data: Any = None


class ReportFinalEvent(BaseModel):
    """Final SSE event carrying the complete LeaseLensReport."""

    event: Literal["report_final"] = "report_final"
    report: dict


class HeartbeatEvent(BaseModel):
    """Keep-alive SSE event."""

    event: Literal["heartbeat"] = "heartbeat"


class ErrorEvent(BaseModel):
    """SSE error event."""

    event: Literal["error"] = "error"
    agent: str | None = None
    message: str
