from src.exceptions.base import FrontMatterError


class StreamingError(FrontMatterError):
    """SSE streaming pipeline failure."""


class StreamClosedError(StreamingError):
    """Client disconnected mid-stream."""
