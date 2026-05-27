from pydantic import BaseModel, Field


class BlueprintElement(BaseModel):
    type: str = Field(..., pattern="^(door|window|wall|fixture)$")
    x: float
    y: float
    w: float
    h: float
    label: str = ""


class HeatZone(BaseModel):
    x: float
    y: float
    radius: float
    intensity: float = Field(ge=0.0, le=1.0)
    type: str = Field(..., pattern="^(high_visibility|operational_friction|neutral)$")


class FlowPoint(BaseModel):
    x: float
    y: float


class ZoneInsight(BaseModel):
    x: float
    y: float
    type: str = Field(..., pattern="^(opportunity|friction)$")
    title: str
    reason: str


class SpatialBlueprint(BaseModel):
    aspectRatio: float
    elements: list[BlueprintElement]
    heatZones: list[HeatZone]
    flowPath: list[FlowPoint] = Field(
        default_factory=lambda: [
            FlowPoint(x=8, y=52),
            FlowPoint(x=35, y=52),
            FlowPoint(x=62, y=30),
        ]
    )
    zoneInsights: list[ZoneInsight] = Field(
        default_factory=lambda: [
            ZoneInsight(
                x=22,
                y=52,
                type="opportunity",
                title="ENTRY CONVERSION",
                reason="Capture first-contact visibility near the entrance.",
            ),
            ZoneInsight(
                x=78,
                y=78,
                type="friction",
                title="LOW EXPOSURE",
                reason="Back corner needs a destination or reduced inventory.",
            ),
        ]
    )
