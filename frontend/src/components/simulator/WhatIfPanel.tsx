"use client";

import type { ProfitResult } from "@/math/profit";
import { RentGauge } from "./RentGauge";
import { PaybackDisplay } from "./PaybackDisplay";

interface WhatIfPanelProps {
  result: ProfitResult;
  paybackMonths: number;
  rentPressure: number;
  initialCost: number;
}

export function WhatIfPanel({
  result,
  paybackMonths,
  rentPressure,
  initialCost,
}: WhatIfPanelProps) {
  return (
    <div className="flex flex-col p-4 space-y-4">
      <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
        What-If Simulator
      </div>

      {/* Rent Pressure Gauge */}
      <RentGauge value={rentPressure} />

      {/* Payback Display */}
      <PaybackDisplay months={paybackMonths} isCritical={result.isCritical} />

      {/* Profit Summary */}
      <div className="space-y-2 pt-2 border-t border-zinc-800">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500 font-mono">Net Profit</span>
          <span
            className={cn(
              "font-mono font-bold",
              result.isCritical ? "text-red-500" : "text-green-500"
            )}
          >
            ${result.netProfit.toFixed(0)}/mo
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500 font-mono">Gross Revenue</span>
          <span className="font-mono text-zinc-300">
            ${result.grossRevenue.toFixed(0)}/mo
          </span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500 font-mono">Initial Cost</span>
          <span className="font-mono text-zinc-300">
            ${initialCost.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
