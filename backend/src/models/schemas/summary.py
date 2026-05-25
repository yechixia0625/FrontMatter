from pydantic import BaseModel, Field


class Summary(BaseModel):
    score: int = Field(ge=0, le=100)
    verdict: str
    paybackMonths: float
