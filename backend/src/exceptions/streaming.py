from src.exceptions.base import LeaseLensError


class StreamingError(LeaseLensError):
    """SSE streaming pipeline failure."""


class StreamClosedError(StreamingError):
    """Client disconnected mid-stream."""
