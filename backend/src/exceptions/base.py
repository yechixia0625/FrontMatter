class FrontMatterError(Exception):
    """Base exception for all FrontMatter errors."""

    def __init__(self, message: str = "", detail: dict | None = None):
        self.message = message
        self.detail = detail or {}
        super().__init__(self.message)


class NotFoundError(FrontMatterError):
    """Resource not found."""


class ValidationError(FrontMatterError):
    """Input validation failure."""
