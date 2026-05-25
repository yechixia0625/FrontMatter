import json
from asyncio import Queue

from src.models.schemas.streaming import AgentLogEvent


class SSEStreamManager:
    """Manages SSE event formatting and a per-session event queue."""

    def __init__(self):
        self._queue: Queue[AgentLogEvent | None] = Queue()

    async def emit(self, event: AgentLogEvent) -> None:
        """Push an event into the stream queue."""
        await self._queue.put(event)

    async def read(self) -> AgentLogEvent | None:
        """Read the next event until producers explicitly close the stream."""
        return await self._queue.get()

    async def close(self) -> None:
        """Signal stream completion."""
        await self._queue.put(None)

    @staticmethod
    def format_sse(event_type: str, data: dict) -> str:
        """Format data as an SSE string."""
        return f"event: {event_type}\ndata: {json.dumps(data)}\n\n"

    @staticmethod
    def format_data(data: dict) -> str:
        """Format an unnamed SSE data frame for the terminal report payload."""
        return f"data: {json.dumps(data)}\n\n"
