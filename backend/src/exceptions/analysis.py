from src.exceptions.base import FrontMatterError


class AnalysisError(FrontMatterError):
    """Analysis pipeline failure."""


class AnalysisValidationError(AnalysisError):
    """Analysis output failed schema validation."""
