from pydantic import BaseModel, Field


class FinancialModel(BaseModel):
    baseRent: float
    expectedTraffic: int
    conversionRate: float = Field(ge=0.0, le=1.0)
    averageSpend: float
    grossMargin: float = Field(ge=0.0, le=1.0)
    fixedCostNonRent: float
    initialDecorationCost: float
