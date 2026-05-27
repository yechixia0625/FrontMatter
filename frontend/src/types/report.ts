import type { FinancialModel } from "./financial";
import type { MapData } from "./map";
import type { SpatialBlueprint } from "./spatial";

export interface Summary {
  score: number; // 0-100
  verdict: string;
  paybackMonths: number;
  scoreBreakdown?: ScoreBreakdown | null;
}

export interface MonthlyCashFlow {
  month: number;
  grossRevenue: number;
  grossProfit: number;
  baseRent: number;
  turnoverRent: number;
  occupancyCost: number;
  operatingCost: number;
  initialOutflow: number;
  depositRecovery: number;
  reinstatementCost: number;
  netCashFlow: number;
  discountedCashFlow: number;
}

export interface ScenarioResult {
  key: string;
  revenueMultiplier: number;
  costMultiplier: number;
  npv: number;
  irrAnnual?: number | null;
  discountedPaybackMonths?: number | null;
  totalNetCashFlow: number;
}

export interface EconomicAnalysis {
  cashFlows: MonthlyCashFlow[];
  npv: number;
  irrAnnual?: number | null;
  discountedPaybackMonths?: number | null;
  breakEvenRevenue: number;
  breakEvenDailyCustomers: number;
  discountRateAnnual: number;
  scenarios: Record<string, ScenarioResult>;
}

export interface BenchmarkSource {
  id: string;
  publisher: string;
  title: string;
  url: string;
  licence: string;
  accessedDate: string;
  dataUpdatedDate?: string | null;
}

export interface BenchmarkObservation {
  key: string;
  label: string;
  value?: number | null;
  unit: string;
  period?: string | null;
  geography: string;
  status: "observed" | "reference_only" | "unavailable";
  sourceId: string;
  usedInCashFlow: boolean;
  note?: string | null;
}

export interface MarketBenchmarkBundle {
  status: "context_available" | "unavailable";
  retrievalMode: "snapshot" | "live";
  snapshotVersion: string;
  sources: BenchmarkSource[];
  observations: BenchmarkObservation[];
  note: string;
}

export interface ScoreEvidence {
  label: string;
  value: string;
  source?: string | null;
}

export interface ScoreComponent {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  rationale: string;
  evidence: ScoreEvidence[];
  assumptionsUsed?: string[];
}

export interface RiskFlag {
  domain: string;
  severity: "critical" | "warning" | "info";
  message: string;
  source?: string | null;
  blocking: boolean;
}

export interface ScoreBreakdown {
  fixedScore: number;
  maxFixedScore: number;
  llmScore: number;
  maxLlmScore: number;
  totalScore: number;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  components: ScoreComponent[];
  riskFlags: RiskFlag[];
}

export interface SourceLink {
  label: string;
  url: string;
}

export interface CandidateLocation {
  name: string;
  address: string;
  country: "Singapore";
  area: string;
  lat: number;
  lng: number;
  score: number;
  rentBenchmark: string;
  estimatedMonthlyRent: number;
  nearbySignals: string[];
  pros: string[];
  cons: string[];
  sourceLinks: SourceLink[];
}

export interface LeaseLensReport {
  summary: Summary;
  spatialBlueprint: SpatialBlueprint;
  financialModel: FinancialModel;
  economicAnalysis: EconomicAnalysis;
  marketBenchmarks: MarketBenchmarkBundle;
  mapData: MapData;
  recommendedLocations: CandidateLocation[];
}
