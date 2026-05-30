"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { AgentLogEvent } from "@/types/streaming";

interface AgentStatusRailProps {
  agentLogs: Record<string, AgentLogEvent[]>;
  isComplete: boolean;
}

const AGENT_ORDER = [
  { key: "spatial", label: "Spatial" },
  { key: "finance", label: "Finance" },
  { key: "competition", label: "Competition" },
  { key: "strategy", label: "Strategy" },
] as const;

export function AgentStatusRail({ agentLogs, isComplete }: AgentStatusRailProps) {
  const { t } = useI18n();
  return (
    <div className="border-b border-zinc-800 bg-zinc-950/90 px-4 py-2.5">
      <div className="grid grid-cols-4 gap-2">
        {AGENT_ORDER.map((agent) => {
          const logs = agentLogs[agent.key] ?? [];
          const lastLog = [...logs].reverse().find((entry) => entry.message);
          const status = lastLog?.status ?? (isComplete ? "done" : "running");
          const tone =
            status === "error"
              ? "bg-red-500"
              : status === "done"
                ? "bg-lime-300"
                : "bg-amber-300";

          return (
            <section key={agent.key} className="border border-zinc-800 bg-black/40 px-3 py-2">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-400">
                  {t(`agents.${agent.key}`)}
                </span>
                <span className="font-mono text-[9px] uppercase text-zinc-600">
                  {t(`agents.status.${status}`)}
                </span>
              </div>
              <div className="mt-2 h-1 overflow-hidden bg-zinc-900">
                <div className={`h-full w-full ${tone}`} />
              </div>
              <p className="mt-2 line-clamp-1 font-mono text-[10px] text-zinc-600">
                {lastLog?.message ?? t("agents.awaiting")}
              </p>
            </section>
          );
        })}
      </div>
    </div>
  );
}
