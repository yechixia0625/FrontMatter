"use client";

import type { AgentLogEvent } from "@/types/streaming";

interface AgentTerminalProps {
  label: string;
  logs: AgentLogEvent[];
  isComplete: boolean;
}

export function AgentTerminal({ label, logs, isComplete }: AgentTerminalProps) {
  const visibleLogs = logs.filter((log) => log.message);
  const recentLogs = visibleLogs.slice(-2);
  const latestStatus = visibleLogs.at(-1)?.status;
  const statusTone =
    latestStatus === "error"
      ? "bg-red-500"
      : isComplete
        ? "bg-green-500"
        : "bg-yellow-500 animate-pulse";
  const statusText =
    latestStatus === "error" ? "Issue detected" : isComplete ? "Complete" : "Running";

  return (
    <details className="rounded border border-zinc-800 bg-zinc-950/90" open={!isComplete}>
      <summary className="cursor-pointer list-none px-3 py-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${statusTone}`} />
              <span className="font-mono text-[11px] text-zinc-300">{label}</span>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-600">
              {statusText}
            </div>
          </div>
          <div className="font-mono text-[10px] text-zinc-600">
            {visibleLogs.length} events
          </div>
        </div>
        <div className="mt-2 space-y-1">
          {recentLogs.length > 0 ? (
            recentLogs.map((log, index) => (
              <div
                key={`${label}-${index}-${log.message}`}
                className={log.status === "error" ? "text-red-400" : "text-zinc-500"}
              >
                <span className="mr-1 text-zinc-700">{">"}</span>
                <span className="font-mono text-[11px] leading-relaxed">{log.message}</span>
              </div>
            ))
          ) : (
            <div className="font-mono text-[11px] text-zinc-600">
              Awaiting agent output...
            </div>
          )}
        </div>
      </summary>

      <div className="border-t border-zinc-800 px-3 py-2">
        <div className="max-h-36 space-y-1 overflow-y-auto font-mono text-[11px]">
          {visibleLogs.map((log, index) => (
            <div
              key={`${label}-detail-${index}-${log.message}`}
              className={log.status === "error" ? "text-red-400" : "text-zinc-500"}
            >
              <span className="mr-1 text-zinc-700">{">"}</span>
              {log.message}
            </div>
          ))}
          {!isComplete && (
            <span className="inline-block h-3 w-1.5 bg-white terminal-cursor" />
          )}
        </div>
      </div>
    </details>
  );
}
