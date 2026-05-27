from src.models.schemas.economics import LeaseEconomicsInput
from src.services.economics import project_lease_economics


def make_assumptions(**overrides) -> LeaseEconomicsInput:
    payload = {
        "leaseTermMonths": 12,
        "baseRent": 5000,
        "serviceChargeMonthly": 500,
        "otherOccupancyCostsMonthly": 0,
        "fixedOperatingCostsMonthly": 5500,
        "initialInvestment": 45_000,
        "depositAmount": 10_000,
        "reinstatementCost": 4000,
        "dailyPayingCustomers": 110,
        "averageSpend": 18,
        "grossMargin": 0.68,
        "rentFreeMonths": 2,
        "annualRentEscalation": 0,
        "annualRevenueGrowth": 0,
        "turnoverRentRate": 0,
        "openingRampMonths": 2,
        "discountRateAnnual": 0.08,
    }
    payload.update(overrides)
    return LeaseEconomicsInput(**payload)


def test_project_cash_flow_applies_free_rent_ramp_and_deposit_recovery():
    result = project_lease_economics(make_assumptions())

    assert result.cashFlows[0].initialOutflow == 55_000
    assert result.cashFlows[1].baseRent == 0
    assert result.cashFlows[-1].depositRecovery == 10_000
    assert result.cashFlows[-1].reinstatementCost == 4000


def test_scenario_downside_has_lower_npv_than_baseline():
    result = project_lease_economics(make_assumptions())

    assert result.scenarios["downside"].npv < result.scenarios["baseline"].npv
    assert result.scenarios["severe_downside"].npv < result.scenarios["downside"].npv


def test_discounted_payback_and_break_even_are_reported_for_profitable_lease():
    result = project_lease_economics(
        make_assumptions(
            leaseTermMonths=36,
            dailyPayingCustomers=190,
            openingRampMonths=0,
        )
    )

    assert result.npv > 0
    assert result.discountedPaybackMonths is not None
    assert result.breakEvenRevenue > 0
    assert result.breakEvenDailyCustomers > 0
