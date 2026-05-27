export interface BlueprintElement {
  type: "door" | "window" | "wall" | "fixture";
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
}

export interface HeatZone {
  x: number;
  y: number;
  radius: number;
  intensity: number; // 0.0 - 1.0
  type: "high_visibility" | "operational_friction" | "neutral";
}

export interface SpatialBlueprint {
  aspectRatio: number;
  elements: BlueprintElement[];
  heatZones: HeatZone[];
  flowPath: Array<{ x: number; y: number }>;
  zoneInsights: Array<{
    x: number;
    y: number;
    type: "opportunity" | "friction";
    title: string;
    reason: string;
  }>;
}
