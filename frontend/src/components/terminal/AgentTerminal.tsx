"use client";

import { useEffect, useRef } from "react";
import type { AgentLogEvent } from "@/types/streaming";

interface AgentTerminalProps {
  label: string;
  logs: AgentLogEvent[];
  isComplete: boolean;
}

export function AgentTerminal({ label, logs, isComplete }: AgentTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col bg-zinc-950 border border-zinc-800 rounded overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 border-b border-zinc-800">
        <div
          className={`w-2 h-2 rounded-full ${isComplete ? "bg-green-500" : "bg-yellow-500 animate-pulse"}`}
        />
        <span className="font-mono text-xs text-zinc-400">{label}</span>
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-1 p-2 overflow-y-auto font-mono text-xs space-y-0.5"
      >
        {logs.filter((log) => log.message).map((log, i) => (
          <div
            key={i}
            className={log.status === "error" ? "text-red-500" : "text-zinc-400"}
          >
            <span className="text-zinc-600">{">"}</span> {log.message}
          </div>
        ))}
        {!isComplete && (
          <span className="inline-block w-1.5 h-3 bg-white terminal-cursor" />
        )}
      </div>
    </div>
  );
}
