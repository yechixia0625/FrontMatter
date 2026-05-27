export type ActualOutcome =
  | "operating_profitable"
  | "operating_unprofitable"
  | "abandoned_before_opening"
  | "closed";

export interface AnonymousOutcomeRecord {
  modelVersion: string;
  businessType: string;
  predictedNpv: number;
  predictedMonthlyNetProfit: number;
  predictedVerdict: string;
  actualMonthlyNetProfit: number;
  actualOutcome: ActualOutcome;
}

export interface AnonymousOutcomeDataset {
  datasetVersion: "anonymous-outcomes-v1";
  exportedAt: string;
  records: AnonymousOutcomeRecord[];
}

export interface CalibrationSummary {
  status: "insufficient_sample_size" | "available";
  sampleSize: number;
  minimumSampleSize: number;
  meanAbsoluteMonthlyProfitError?: number | null;
  meanMonthlyProfitError?: number | null;
  profitableOutcomeRate?: number | null;
}
