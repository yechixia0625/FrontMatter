"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { CandidateEvaluation } from "@/types/report";

interface CandidateComparisonPanelProps {
  candidates: CandidateEvaluation[];
}

export function CandidateComparisonPanel({ candidates }: CandidateComparisonPanelProps) {
  const { t } = useI18n();
  if (candidates.length === 0) return null;
  const ranked = [...candidates].sort(
    (left, right) => right.economicAnalysis.npv - left.economicAnalysis.npv
  );

  return (
    <section className="border-b border-zinc-800 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {t("candidateComparison.title")}
      </div>
      <p className="mt-1 font-mono text-[9px] uppercase text-zinc-600">
        {t("candidateComparison.subtitle")}
      </p>
      <div className="mt-3 space-y-2">
        {ranked.map((candidate, index) => (
          <article key={`${candidate.label}-${candidate.latitude}`} className="border border-zinc-800 p-2.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-[9px] text-zinc-500">
                  {t("candidateComparison.rank", { index: index + 1 })}
                </div>
                <div className="truncate text-[11px] text-zinc-200">{candidate.label}</div>
              </div>
              <div className="shrink-0 text-right font-mono text-[10px]">
                <div className={candidate.economicAnalysis.npv >= 0 ? "text-lime-300" : "text-amber-300"}>
                  {formatMoney(candidate.economicAnalysis.npv)}
                </div>
                <div className="text-zinc-600">{t("candidateComparison.npv")}</div>
              </div>
            </div>
            <div className="mt-2 flex justify-between border-t border-zinc-800 pt-2 font-mono text-[9px] text-zinc-500">
              <span>{t("candidateComparison.rent", { value: formatMoney(candidate.monthlyRent) })}</span>
              <span>{t("candidateComparison.nearby", { count: candidate.mapData.competitors.length })}</span>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-3 font-mono text-[9px] uppercase leading-4 text-zinc-600">
        {t("candidateComparison.footer")}
      </p>
    </section>
  );
}

function formatMoney(value: number): string {
  const absolute = Math.abs(Math.round(value)).toLocaleString("en-SG");
  return `${value < 0 ? "-" : ""}S$${absolute}`;
}
