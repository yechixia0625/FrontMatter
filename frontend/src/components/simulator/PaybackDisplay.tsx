"use client";

import { cn } from "@/lib/utils";

interface PaybackDisplayProps {
  months: number;
  isCritical: boolean;
}

export function PaybackDisplay({ months, isCritical }: PaybackDisplayProps) {
  const displayValue = isFinite(months) ? months.toFixed(1) : "N/A";

  return (
    <div className="flex flex-col items-center space-y-1 pt-2 border-t border-zinc-800">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
        Payback Period
      </span>
      <div
        className={cn(
          "text-5xl font-mono font-bold tabular-nums",
          isCritical ? "text-red-500 animate-critical" : "text-white"
        )}
      >
        {displayValue}
      </div>
      <span className="text-xs font-mono text-zinc-600">
        {isFinite(months) ? "months" : ""}
      </span>
      {isCritical && (
        <span className="text-xs font-mono text-red-500 uppercase tracking-wider">
          CRITICAL
        </span>
      )}
    </div>
  );
}
