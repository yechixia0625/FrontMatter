import type { EconomicAnalysis } from "@/types/report";

interface EconomicAnalysisPanelProps {
  analysis: EconomicAnalysis;
}

export function EconomicAnalysisPanel({ analysis }: EconomicAnalysisPanelProps) {
  const scenarios = [
    ["BASE", analysis.scenarios.baseline],
    ["DOWN -10%", analysis.scenarios.downside],
    ["SEVERE -25%", analysis.scenarios.severe_downside],
  ] as const;

  return (
    <section className="border-b border-zinc-800 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        Discounted Cash Flow
      </div>
      <div className="mt-3 grid grid-cols-2 gap-px bg-zinc-800">
        <Metric label="NPV" value={formatMoney(analysis.npv)} strong={analysis.npv >= 0} />
        <Metric
          label="IRR"
          value={analysis.irrAnnual == null ? "N/A" : formatPercent(analysis.irrAnnual)}
          strong={(analysis.irrAnnual ?? -1) >= analysis.discountRateAnnual}
        />
        <Metric
          label="Discounted Payback"
          value={
            analysis.discountedPaybackMonths == null
              ? "NOT REACHED"
              : `${analysis.discountedPaybackMonths.toFixed(1)} MO`
          }
        />
        <Metric
          label="Break-Even Customers"
          value={`${analysis.breakEvenDailyCustomers.toFixed(1)} / DAY`}
        />
      </div>

      <div className="mt-3 space-y-1.5">
        {scenarios.map(([label, scenario]) => (
          <div
            key={label}
            className="flex items-center justify-between border border-zinc-800 px-2.5 py-2 font-mono text-[10px]"
          >
            <span className="text-zinc-500">{label}</span>
            <span className={scenario.npv >= 0 ? "text-lime-300" : "text-amber-300"}>
              NPV {formatMoney(scenario.npv)}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 border-l border-zinc-700 pl-2 font-mono text-[9px] uppercase leading-4 text-zinc-600">
        Based on disclosed assumptions. Not a turnover guarantee.
      </p>
    </section>
  );
}

function Metric({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="bg-black px-2.5 py-2.5">
      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-zinc-600">
        {label}
      </div>
      <div
        className={`mt-1 break-words font-mono text-[12px] ${
          strong === true ? "text-lime-300" : strong === false ? "text-amber-300" : "text-zinc-200"
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function formatMoney(value: number): string {
  const absolute = Math.abs(Math.round(value)).toLocaleString("en-SG");
  return `${value < 0 ? "-" : ""}S$${absolute}`;
}

function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
