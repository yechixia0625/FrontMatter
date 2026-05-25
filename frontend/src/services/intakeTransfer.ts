export interface AnalysisIntake {
  businessType: string;
  expectedRent: number;
  squareMeters: number;
  location: SiteLocation;
}

export interface SiteLocation {
  mode: "current" | "address";
  latitude: number;
  longitude: number;
  siteLabel?: string;
}

export interface PendingAnalysis {
  file: File;
  intake: AnalysisIntake;
}

let pendingAnalysis: PendingAnalysis | null = null;

export function storePendingAnalysis(analysis: PendingAnalysis): void {
  pendingAnalysis = analysis;
}

export function getPendingAnalysis(): PendingAnalysis | null {
  return pendingAnalysis;
}
