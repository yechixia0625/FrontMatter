"use client";

import { AgentTerminal } from "@/components/terminal/AgentTerminal";
import { VerdictStamp } from "@/components/terminal/VerdictStamp";
import type { AgentLogEvent } from "@/types/streaming";

interface TerminalGridProps {
  agentLogs: Record<string, AgentLogEvent[]>;
  verdict?: string;
  isComplete: boolean;
}

export function TerminalGrid({ agentLogs, verdict, isComplete }: TerminalGridProps) {
  return (
    <div className="flex-1 flex flex-col p-2 gap-2 overflow-hidden">
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2 overflow-hidden">
        <AgentTerminal label="[Spatial]" logs={agentLogs.spatial ?? []} isComplete={isComplete} />
        <AgentTerminal label="[Finance]" logs={agentLogs.finance ?? []} isComplete={isComplete} />
        <AgentTerminal label="[Competition]" logs={agentLogs.competition ?? []} isComplete={isComplete} />
        <AgentTerminal label="[Strategy]" logs={agentLogs.strategy ?? []} isComplete={isComplete} />
      </div>
      {isComplete && verdict && <VerdictStamp verdict={verdict} />}
    </div>
  );
}
