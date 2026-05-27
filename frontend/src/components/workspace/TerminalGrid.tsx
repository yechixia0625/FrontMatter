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
    <div className="flex h-full flex-col gap-3 p-3">
      <div className="shrink-0 border border-zinc-800 bg-zinc-950/80 px-3 py-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          Multi-Agent Stream
        </div>
        <p className="mt-1 text-xs leading-relaxed text-zinc-600">
          Compact live status. Expand any agent to inspect the full trace.
        </p>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        <AgentTerminal label="[Spatial]" logs={agentLogs.spatial ?? []} isComplete={isComplete} />
        <AgentTerminal label="[Finance]" logs={agentLogs.finance ?? []} isComplete={isComplete} />
        <AgentTerminal label="[Competition]" logs={agentLogs.competition ?? []} isComplete={isComplete} />
        <AgentTerminal label="[Strategy]" logs={agentLogs.strategy ?? []} isComplete={isComplete} />
      </div>
      {isComplete && verdict && (
        <div className="shrink-0">
          <VerdictStamp verdict={verdict} />
        </div>
      )}
    </div>
  );
}
