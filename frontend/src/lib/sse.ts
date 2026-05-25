import type { LeaseLensReport } from "@/types/report";
import type { AgentLogEvent, ErrorEvent } from "@/types/streaming";

export type StreamPayload =
  | { kind: "agent_log"; event: AgentLogEvent }
  | { kind: "error"; event: ErrorEvent }
  | { kind: "report"; report: LeaseLensReport }
  | { kind: "unknown" };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isLeaseLensReport(value: unknown): value is LeaseLensReport {
  if (!isRecord(value)) return false;
  return (
    isRecord(value.summary) &&
    isRecord(value.spatialBlueprint) &&
    isRecord(value.financialModel) &&
    isRecord(value.mapData)
  );
}

export function classifySSEPayload(value: unknown): StreamPayload {
  if (!isRecord(value)) return { kind: "unknown" };
  if (value.event === "agent_log" && typeof value.agent === "string") {
    return { kind: "agent_log", event: value as unknown as AgentLogEvent };
  }
  if (value.event === "error" && typeof value.message === "string") {
    return { kind: "error", event: value as unknown as ErrorEvent };
  }
  if (isLeaseLensReport(value)) {
    return { kind: "report", report: value };
  }
  return { kind: "unknown" };
}
