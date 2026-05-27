from pydantic import BaseModel, Field


class LeaseEconomicsInput(BaseModel):
    leaseTermMonths: int = Field(gt=0)
    baseRent: float = Field(ge=0)
    serviceChargeMonthly: float = Field(ge=0)
    otherOccupancyCostsMonthly: float = Field(ge=0)
    fixedOperatingCostsMonthly: float = Field(ge=0)
    initialInvestment: float = Field(ge=0)
    depositAmount: float = Field(ge=0)
    reinstatementCost: float = Field(ge=0)
    dailyPayingCustomers: float = Field(ge=0)
    averageSpend: float = Field(gt=0)
    grossMargin: float = Field(gt=0, le=1)
    rentFreeMonths: int = Field(ge=0)
    annualRentEscalation: float = Field(ge=0, le=1)
    annualRevenueGrowth: float = Field(ge=-1, le=1)
    turnoverRentRate: float = Field(ge=0, le=1)
    openingRampMonths: int = Field(ge=0, le=24)
    discountRateAnnual: float = Field(ge=0, le=1)


class MonthlyCashFlow(BaseModel):
    month: int = Field(ge=0)
    grossRevenue: float
    grossProfit: float
    baseRent: float
    turnoverRent: float
    occupancyCost: float
    operatingCost: float
    initialOutflow: float = 0
    depositRecovery: float = 0
    reinstatementCost: float = 0
    netCashFlow: float
    discountedCashFlow: float


class ScenarioResult(BaseModel):
    key: str
    revenueMultiplier: float
    costMultiplier: float
    npv: float
    irrAnnual: float | None
    discountedPaybackMonths: float | None
    totalNetCashFlow: float


class LeaseEconomicsResult(BaseModel):
    cashFlows: list[MonthlyCashFlow]
    npv: float
    irrAnnual: float | None
    discountedPaybackMonths: float | None
    breakEvenRevenue: float
    breakEvenDailyCustomers: float
    discountRateAnnual: float
    scenarios: dict[str, ScenarioResult]
