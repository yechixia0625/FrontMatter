import type {
  AnonymousOutcomeDataset,
  AnonymousOutcomeRecord,
  CalibrationSummary,
} from "@/types/calibration";

const BASE_PATH = "/api/v1/calibration";

export class CalibrationService {
  static async recordOutcome(payload: AnonymousOutcomeRecord): Promise<AnonymousOutcomeRecord> {
    return request<AnonymousOutcomeRecord>("/outcomes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  static async summary(): Promise<CalibrationSummary> {
    return request<CalibrationSummary>("/summary");
  }

  static async exportDataset(): Promise<AnonymousOutcomeDataset> {
    return request<AnonymousOutcomeDataset>("/export");
  }

  static async importDataset(
    payload: AnonymousOutcomeDataset
  ): Promise<AnonymousOutcomeDataset> {
    return request<AnonymousOutcomeDataset>("/import", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_PATH}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!response.ok) {
    throw new Error(`Calibration request failed: HTTP ${response.status}`);
  }
  return response.json();
}
