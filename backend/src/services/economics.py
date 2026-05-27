from src.models.schemas.economics import (
    LeaseEconomicsInput,
    LeaseEconomicsResult,
    MonthlyCashFlow,
    ScenarioResult,
)

SCENARIOS = {
    "baseline": {"revenue_multiplier": 1.0, "cost_multiplier": 1.0},
    "downside": {"revenue_multiplier": 0.90, "cost_multiplier": 1.05},
    "severe_downside": {"revenue_multiplier": 0.75, "cost_multiplier": 1.10},
}


def project_lease_economics(assumptions: LeaseEconomicsInput) -> LeaseEconomicsResult:
    scenarios: dict[str, ScenarioResult] = {}
    baseline_cash_flows: list[MonthlyCashFlow] = []
    for key, scenario in SCENARIOS.items():
        cash_flows = _project_scenario(
            assumptions,
            revenue_multiplier=scenario["revenue_multiplier"],
            cost_multiplier=scenario["cost_multiplier"],
        )
        npv = net_present_value(
            [cash_flow.netCashFlow for cash_flow in cash_flows],
            assumptions.discountRateAnnual,
        )
        irr = internal_rate_of_return([cash_flow.netCashFlow for cash_flow in cash_flows])
        payback = discounted_payback_months(
            [cash_flow.netCashFlow for cash_flow in cash_flows],
            assumptions.discountRateAnnual,
        )
        scenarios[key] = ScenarioResult(
            key=key,
            revenueMultiplier=scenario["revenue_multiplier"],
            costMultiplier=scenario["cost_multiplier"],
            npv=round(npv, 2),
            irrAnnual=None if irr is None else round(irr, 4),
            discountedPaybackMonths=payback,
            totalNetCashFlow=round(sum(row.netCashFlow for row in cash_flows), 2),
        )
        if key == "baseline":
            baseline_cash_flows = cash_flows

    denominator = assumptions.grossMargin - assumptions.turnoverRentRate
    steady_occupancy = (
        assumptions.baseRent
        + assumptions.serviceChargeMonthly
        + assumptions.otherOccupancyCostsMonthly
    )
    break_even_revenue = (
        (steady_occupancy + assumptions.fixedOperatingCostsMonthly) / denominator
        if denominator > 0
        else float("inf")
    )
    break_even_customers = break_even_revenue / (assumptions.averageSpend * 30)
    baseline = scenarios["baseline"]
    return LeaseEconomicsResult(
        cashFlows=baseline_cash_flows,
        npv=baseline.npv,
        irrAnnual=baseline.irrAnnual,
        discountedPaybackMonths=baseline.discountedPaybackMonths,
        breakEvenRevenue=round(break_even_revenue, 2),
        breakEvenDailyCustomers=round(break_even_customers, 1),
        discountRateAnnual=assumptions.discountRateAnnual,
        scenarios=scenarios,
    )


def net_present_value(cash_flows: list[float], annual_discount_rate: float) -> float:
    monthly_rate = _monthly_rate(annual_discount_rate)
    return sum(value / ((1 + monthly_rate) ** month) for month, value in enumerate(cash_flows))


def internal_rate_of_return(cash_flows: list[float]) -> float | None:
    if not cash_flows or min(cash_flows) >= 0 or max(cash_flows) <= 0:
        return None
    low = -0.9999
    high = 10.0
    for _ in range(120):
        midpoint = (low + high) / 2
        value = sum(
            cash_flow / ((1 + midpoint) ** month)
            for month, cash_flow in enumerate(cash_flows)
        )
        if value > 0:
            low = midpoint
        else:
            high = midpoint
    monthly_irr = (low + high) / 2
    return (1 + monthly_irr) ** 12 - 1


def discounted_payback_months(
    cash_flows: list[float], annual_discount_rate: float
) -> float | None:
    monthly_rate = _monthly_rate(annual_discount_rate)
    cumulative = 0.0
    prior_cumulative = 0.0
    for month, cash_flow in enumerate(cash_flows):
        discounted = cash_flow / ((1 + monthly_rate) ** month)
        prior_cumulative = cumulative
        cumulative += discounted
        if cumulative >= 0:
            if month == 0 or discounted == 0:
                return float(month)
            fraction = -prior_cumulative / discounted
            return round(month - 1 + fraction, 1)
    return None


def _project_scenario(
    assumptions: LeaseEconomicsInput,
    *,
    revenue_multiplier: float,
    cost_multiplier: float,
) -> list[MonthlyCashFlow]:
    monthly_rate = _monthly_rate(assumptions.discountRateAnnual)
    initial_outflow = assumptions.initialInvestment + assumptions.depositAmount
    cash_flows = [
        MonthlyCashFlow(
            month=0,
            grossRevenue=0,
            grossProfit=0,
            baseRent=0,
            turnoverRent=0,
            occupancyCost=0,
            operatingCost=0,
            initialOutflow=round(initial_outflow, 2),
            netCashFlow=round(-initial_outflow, 2),
            discountedCashFlow=round(-initial_outflow, 2),
        )
    ]
    for month in range(1, assumptions.leaseTermMonths + 1):
        annual_period = (month - 1) // 12
        base_rent = 0.0
        if month > assumptions.rentFreeMonths:
            base_rent = assumptions.baseRent * (
                (1 + assumptions.annualRentEscalation) ** annual_period
            )
        revenue_growth = (1 + assumptions.annualRevenueGrowth) ** annual_period
        gross_revenue = (
            assumptions.dailyPayingCustomers
            * 30
            * assumptions.averageSpend
            * _ramp_factor(month, assumptions.openingRampMonths)
            * revenue_growth
            * revenue_multiplier
        )
        gross_profit = gross_revenue * assumptions.grossMargin
        turnover_rent = gross_revenue * assumptions.turnoverRentRate
        variable_occupancy_cost = (
            assumptions.serviceChargeMonthly + assumptions.otherOccupancyCostsMonthly
        ) * cost_multiplier
        occupancy_cost = base_rent + turnover_rent + variable_occupancy_cost
        operating_cost = assumptions.fixedOperatingCostsMonthly * cost_multiplier
        deposit_recovery = (
            assumptions.depositAmount if month == assumptions.leaseTermMonths else 0.0
        )
        reinstatement_cost = (
            assumptions.reinstatementCost if month == assumptions.leaseTermMonths else 0.0
        )
        net_cash_flow = (
            gross_profit
            - occupancy_cost
            - operating_cost
            + deposit_recovery
            - reinstatement_cost
        )
        cash_flows.append(
            MonthlyCashFlow(
                month=month,
                grossRevenue=round(gross_revenue, 2),
                grossProfit=round(gross_profit, 2),
                baseRent=round(base_rent, 2),
                turnoverRent=round(turnover_rent, 2),
                occupancyCost=round(occupancy_cost, 2),
                operatingCost=round(operating_cost, 2),
                depositRecovery=round(deposit_recovery, 2),
                reinstatementCost=round(reinstatement_cost, 2),
                netCashFlow=round(net_cash_flow, 2),
                discountedCashFlow=round(net_cash_flow / ((1 + monthly_rate) ** month), 2),
            )
        )
    return cash_flows


def _monthly_rate(annual_rate: float) -> float:
    return (1 + annual_rate) ** (1 / 12) - 1


def _ramp_factor(month: int, ramp_months: int) -> float:
    if ramp_months == 0 or month > ramp_months:
        return 1.0
    return 0.5 + (month - 1) * (0.5 / ramp_months)
