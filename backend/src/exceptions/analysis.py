from src.exceptions.base import LeaseLensError


class AnalysisError(LeaseLensError):
    """Analysis pipeline failure."""


class AnalysisValidationError(AnalysisError):
    """Analysis output failed schema validation."""
