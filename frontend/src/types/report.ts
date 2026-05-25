import type { FinancialModel } from "./financial";
import type { MapData } from "./map";
import type { SpatialBlueprint } from "./spatial";

export interface Summary {
  score: number; // 0-100
  verdict: string;
  paybackMonths: number;
}

export interface LeaseLensReport {
  summary: Summary;
  spatialBlueprint: SpatialBlueprint;
  financialModel: FinancialModel;
  mapData: MapData;
}
