export type AgentStatus = "running" | "done" | "error";

export interface AgentLogEvent {
  event: "agent_log";
  agent: string;
  label: string;
  message: string;
  status: AgentStatus;
  data?: Record<string, unknown>;
}

export interface HeartbeatEvent {
  event: "heartbeat";
}

export interface ErrorEvent {
  event: "error";
  agent?: string;
  message: string;
}

export type SSEEvent = AgentLogEvent | HeartbeatEvent | ErrorEvent;
