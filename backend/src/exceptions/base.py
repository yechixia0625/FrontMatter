class LeaseLensError(Exception):
    """Base exception for all LeaseLens errors."""

    def __init__(self, message: str = "", detail: dict | None = None):
        self.message = message
        self.detail = detail or {}
        super().__init__(self.message)


class NotFoundError(LeaseLensError):
    """Resource not found."""


class ValidationError(LeaseLensError):
    """Input validation failure."""
