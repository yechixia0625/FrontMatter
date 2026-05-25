from typing import Any

from src.models.schemas.intake import SpaceIntakeRequest

SQM_PER_SQFT = 0.092903


INDUSTRY_PROFILES = {
    "cafe": {"ideal_min": 35, "ideal_max": 120, "rent_psf": 16},
    "coffee": {"ideal_min": 35, "ideal_max": 120, "rent_psf": 16},
    "coffee shop": {"ideal_min": 35, "ideal_max": 120, "rent_psf": 16},
    "bakery": {"ideal_min": 45, "ideal_max": 140, "rent_psf": 14},
    "restaurant": {"ideal_min": 70, "ideal_max": 220, "rent_psf": 18},
    "bar": {"ideal_min": 60, "ideal_max": 180, "rent_psf": 17},
    "bookstore": {"ideal_min": 80, "ideal_max": 260, "rent_psf": 12},
    "boutique": {"ideal_min": 45, "ideal_max": 160, "rent_psf": 19},
}


def enrich_summary(
    intake: SpaceIntakeRequest,
    financial_model: dict[str, Any],
    map_data: dict[str, Any],
    llm_summary: dict[str, Any],
) -> dict[str, Any]:
    """Build the final 60/40 score contract from deterministic and LLM inputs."""
    metrics = _financial_metrics(financial_model)
    components = [
        _financial_component(intake, financial_model, metrics),
        _demand_component(intake, map_data),
        _competition_component(map_data),
        _operational_component(intake),
    ]
    fixed_score = round(sum(component["score"] for component in components))
    fixed_score = int(_clamp(fixed_score, 0, 60))

    llm_raw_score = _number(llm_summary.get("score"), 70)
    llm_score = int(round(_clamp(llm_raw_score, 0, 100) * 0.4))
    llm_score = int(_clamp(llm_score, 0, 40))

    total_score = int(_clamp(fixed_score + llm_score, 0, 100))
    return {
        "score": total_score,
        "verdict": _verdict(total_score),
        "paybackMonths": _payback_months(
            _number(financial_model.get("initialDecorationCost"), 45_000),
            metrics["netProfit"],
        ),
        "scoreBreakdown": {
            "fixedScore": fixed_score,
            "maxFixedScore": 60,
            "llmScore": llm_score,
            "maxLlmScore": 40,
            "totalScore": total_score,
            "confidence": _confidence(map_data),
            "components": components,
        },
    }


def recommend_locations(
    intake: SpaceIntakeRequest,
    map_data: dict[str, Any],
    summary: dict[str, Any],
) -> list[dict[str, Any]]:
    """Return three Singapore candidate locations with verifiable public sources."""
    normalized = intake.business_type.strip().lower()
    candidate_pool = _candidate_pool(normalized)
    base_score = _number(summary.get("score"), 70)
    competitors = len(map_data.get("competitors", []))

    recommendations = []
    for index, candidate in enumerate(candidate_pool[:3]):
        monthly_rent = _estimated_monthly_rent(candidate["rent_psf"], intake.square_meters)
        score = int(_clamp(base_score + candidate["score_delta"] - competitors, 45, 95))
        recommendations.append(
            {
                "name": candidate["name"],
                "address": candidate["address"],
                "country": "Singapore",
                "area": candidate["area"],
                "lat": candidate["lat"],
                "lng": candidate["lng"],
                "score": score,
                "rentBenchmark": (
                    f"~S${candidate['rent_psf']}/sqft/month public market proxy"
                ),
                "estimatedMonthlyRent": monthly_rent,
                "nearbySignals": candidate["nearby_signals"],
                "pros": candidate["pros"],
                "cons": candidate["cons"],
                "sourceLinks": _source_links(candidate),
            }
        )
    return recommendations


def _financial_metrics(financial_model: dict[str, Any]) -> dict[str, float]:
    traffic = _number(financial_model.get("expectedTraffic"), 120)
    conversion = _number(financial_model.get("conversionRate"), 0.08)
    spend = _number(financial_model.get("averageSpend"), 35)
    margin = _number(financial_model.get("grossMargin"), 0.65)
    rent = _number(financial_model.get("baseRent"), 5_200)
    fixed_cost = _number(financial_model.get("fixedCostNonRent"), 2_000)

    gross_revenue = traffic * 30 * conversion * spend
    gross_profit = gross_revenue * margin
    net_profit = gross_profit - rent - fixed_cost
    rent_pressure = rent / gross_revenue if gross_revenue > 0 else 1
    return {
        "grossRevenue": gross_revenue,
        "grossProfit": gross_profit,
        "netProfit": net_profit,
        "rentPressure": rent_pressure,
    }


def _financial_component(
    intake: SpaceIntakeRequest,
    financial_model: dict[str, Any],
    metrics: dict[str, float],
) -> dict[str, Any]:
    pressure_score = _clamp((0.55 - metrics["rentPressure"]) / 0.37 * 15, 0, 15)
    rent = _number(financial_model.get("baseRent"), intake.expected_rent)
    profit_score = _clamp(metrics["netProfit"] / max(rent * 1.5, 1) * 10, 0, 10)
    score = round(pressure_score + profit_score, 1)
    return {
        "key": "financial_viability",
        "label": "Financial viability",
        "score": score,
        "maxScore": 25,
        "rationale": "Uses rent pressure, estimated gross profit, and payback capacity.",
        "evidence": [
            {
                "label": "Monthly rent",
                "value": f"S${rent:,.0f}",
                "source": "user_input",
            },
            {
                "label": "Rent pressure",
                "value": f"{metrics['rentPressure'] * 100:.1f}%",
                "source": "fixed_agent",
            },
            {
                "label": "Estimated net profit",
                "value": f"S${metrics['netProfit']:,.0f}/mo",
                "source": "fixed_agent",
            },
        ],
    }


def _demand_component(intake: SpaceIntakeRequest, map_data: dict[str, Any]) -> dict[str, Any]:
    in_singapore = 1.15 <= intake.latitude <= 1.48 and 103.55 <= intake.longitude <= 104.1
    available = map_data.get("status") == "available"
    competitor_count = len(map_data.get("competitors", []))
    score = 0
    score += 5 if in_singapore else 2
    score += 4 if intake.site_label else 2
    score += 3 if available else 1
    score += 3 if competitor_count > 0 else 1
    return {
        "key": "location_demand",
        "label": "Singapore demand signals",
        "score": score,
        "maxScore": 15,
        "rationale": "Rewards verified Singapore coordinates and live market data coverage.",
        "evidence": [
            {
                "label": "Selected site",
                "value": intake.site_label or "Current GPS coordinate",
                "source": "onemap_or_google_places",
            },
            {
                "label": "Live data",
                "value": "available" if available else "fallback",
                "source": "google_places",
            },
        ],
    }


def _competition_component(map_data: dict[str, Any]) -> dict[str, Any]:
    competitors = map_data.get("competitors", [])
    count = len(competitors)
    high_threats = sum(1 for item in competitors if item.get("threatLevel") == "HIGH")
    if count == 0:
        score = 8
    elif count <= 3:
        score = 11
    elif count <= 7:
        score = 9
    else:
        score = 6
    score = max(score - min(high_threats, 3), 0)
    return {
        "key": "competition_mix",
        "label": "Competition and complement mix",
        "score": score,
        "maxScore": 12,
        "rationale": "Penalizes heavy same-category saturation close to the target site.",
        "evidence": [
            {
                "label": "Nearby same-category places",
                "value": str(count),
                "source": "google_places",
            },
            {
                "label": "High proximity threats",
                "value": str(high_threats),
                "source": "google_places",
            },
        ],
    }


def _operational_component(intake: SpaceIntakeRequest) -> dict[str, Any]:
    profile = _industry_profile(intake.business_type)
    ideal_min = profile["ideal_min"]
    ideal_max = profile["ideal_max"]
    if ideal_min <= intake.square_meters <= ideal_max:
        score = 8
        fit = "within target range"
    elif intake.square_meters < ideal_min:
        score = max(3, round(8 * intake.square_meters / ideal_min, 1))
        fit = "smaller than target range"
    else:
        overage = min((intake.square_meters - ideal_max) / ideal_max, 1)
        score = round(8 * (1 - overage * 0.6), 1)
        fit = "larger than target range"
    return {
        "key": "operational_fit",
        "label": "Operational fit",
        "score": score,
        "maxScore": 8,
        "rationale": "Compares unit size with a conservative industry footprint preset.",
        "evidence": [
            {
                "label": "Input area",
                "value": f"{intake.square_meters:g} sqm",
                "source": "user_input",
            },
            {
                "label": "Industry fit",
                "value": fit,
                "source": "fixed_agent",
            },
        ],
    }


def _candidate_pool(normalized_business_type: str) -> list[dict[str, Any]]:
    food = [
        {
            "name": "Tanjong Pagar Centre retail podium",
            "address": "7 Wallich Street, Singapore 078884",
            "area": "Tanjong Pagar",
            "lat": 1.2764,
            "lng": 103.8459,
            "rent_psf": 18,
            "score_delta": 8,
            "nearby_signals": ["CBD lunch crowd", "MRT interchange access", "office density"],
            "pros": ["Strong weekday footfall", "Premium visibility for coffee or quick service"],
            "cons": ["Higher rent pressure", "Weekend demand can be softer"],
        },
        {
            "name": "Holland Village shophouse cluster",
            "address": "Lorong Mambong, Singapore 277700",
            "area": "Holland Village",
            "lat": 1.3111,
            "lng": 103.7948,
            "rent_psf": 15,
            "score_delta": 6,
            "nearby_signals": ["F&B cluster", "expat catchment", "evening demand"],
            "pros": ["Established cafe and restaurant destination", "Good lifestyle positioning"],
            "cons": ["Competitive F&B cluster", "Unit frontage matters a lot"],
        },
        {
            "name": "Bugis / Haji Lane street retail",
            "address": "21 Haji Lane, Singapore 189214",
            "area": "Bugis",
            "lat": 1.3008,
            "lng": 103.8591,
            "rent_psf": 14,
            "score_delta": 5,
            "nearby_signals": ["tourist traffic", "indie retail cluster", "MRT proximity"],
            "pros": ["Strong discovery traffic", "Works well for distinctive concepts"],
            "cons": ["Narrow units can constrain operations", "Peak periods are uneven"],
        },
    ]
    retail = [
        {
            "name": "ION Orchard retail catchment",
            "address": "2 Orchard Turn, Singapore 238801",
            "area": "Orchard",
            "lat": 1.3040,
            "lng": 103.8320,
            "rent_psf": 24,
            "score_delta": 5,
            "nearby_signals": ["prime retail spine", "tourist traffic", "MRT access"],
            "pros": ["Best-in-class visibility", "Strong comparison shopping demand"],
            "cons": ["Very high rental hurdle", "Brand differentiation must be clear"],
        },
        {
            "name": "Funan urban retail cluster",
            "address": "107 North Bridge Road, Singapore 179105",
            "area": "City Hall",
            "lat": 1.2913,
            "lng": 103.8499,
            "rent_psf": 17,
            "score_delta": 7,
            "nearby_signals": ["office crowd", "civic district", "mall traffic"],
            "pros": ["Balanced weekday and weekend demand", "Good for design-led retail"],
            "cons": ["Mall tenant mix can limit category freedom", "Fit-out rules may be strict"],
        },
        {
            "name": "Tiong Bahru neighbourhood retail",
            "address": "Tiong Bahru Road, Singapore 168732",
            "area": "Tiong Bahru",
            "lat": 1.2852,
            "lng": 103.8320,
            "rent_psf": 13,
            "score_delta": 6,
            "nearby_signals": ["residential catchment", "heritage shops", "cafe culture"],
            "pros": ["Neighbourhood loyalty potential", "Lower rent than prime malls"],
            "cons": ["Smaller catchment than CBD", "Concept must fit local community"],
        },
    ]
    general = [
        {
            "name": "Paya Lebar Quarter retail",
            "address": "10 Paya Lebar Road, Singapore 409057",
            "area": "Paya Lebar",
            "lat": 1.3175,
            "lng": 103.8927,
            "rent_psf": 16,
            "score_delta": 7,
            "nearby_signals": ["MRT interchange", "office and residential mix", "mall traffic"],
            "pros": ["Balanced weekday/weekend catchment", "Good accessibility"],
            "cons": ["Competes with mall tenants", "Rent still needs careful negotiation"],
        },
        food[0],
        retail[2],
    ]
    food_terms = ("cafe", "coffee", "bakery", "restaurant", "bar")
    if any(term in normalized_business_type for term in food_terms):
        return food
    if any(term in normalized_business_type for term in ("retail", "boutique", "book", "shop")):
        return retail
    return general


def _source_links(candidate: dict[str, Any]) -> list[dict[str, str]]:
    query = candidate["address"].replace(" ", "+")
    return [
        {
            "label": "Google Maps",
            "url": f"https://www.google.com/maps/search/?api=1&query={query}",
        },
        {
            "label": "OneMap APIs",
            "url": "https://www.onemap.gov.sg/docs/",
        },
        {
            "label": "Data.gov.sg retail rentals",
            "url": "https://data.gov.sg/dataset/median-rentals-and-vacancy-of-retail-space",
        },
        {
            "label": "HDB commercial renting",
            "url": "https://www.hdb.gov.sg/shops-and-offices/renting-from-hdb",
        },
        {"label": "JTC Find Space", "url": "https://www.jtc.gov.sg/find-space"},
    ]


def _industry_profile(business_type: str) -> dict[str, float]:
    normalized = business_type.strip().lower()
    return INDUSTRY_PROFILES.get(
        normalized,
        {"ideal_min": 40, "ideal_max": 180, "rent_psf": 15},
    )


def _estimated_monthly_rent(rent_psf: float, square_meters: float) -> float:
    square_feet = square_meters / SQM_PER_SQFT
    return round(rent_psf * square_feet, 2)


def _payback_months(initial_cost: float, monthly_net_profit: float) -> float:
    if monthly_net_profit <= 0:
        return 999.0
    return round(initial_cost / monthly_net_profit, 1)


def _confidence(map_data: dict[str, Any]) -> str:
    if map_data.get("status") == "available" and map_data.get("competitors"):
        return "HIGH"
    if map_data.get("status") == "available":
        return "MEDIUM"
    return "LOW"


def _verdict(score: int) -> str:
    if score >= 80:
        return "APPROVED"
    if score >= 60:
        return "APPROVED WITH CONDITIONS"
    return "REJECTED"


def _number(value: Any, fallback: float) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return fallback


def _clamp(value: float, lower: float, upper: float) -> float:
    return max(lower, min(upper, value))
