"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { MarketBenchmarkBundle } from "@/types/report";

interface MarketEvidencePanelProps {
  benchmarks: MarketBenchmarkBundle;
}

export function MarketEvidencePanel({ benchmarks }: MarketEvidencePanelProps) {
  const { t } = useI18n();
  const rentalIndex = benchmarks.observations.find(
    (observation) => observation.key === "ura_retail_rental_index"
  );

  return (
    <section className="border-b border-zinc-800 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
          {t("marketEvidence.title")}
        </div>
        <span className="border border-zinc-800 px-1.5 py-1 font-mono text-[9px] uppercase text-zinc-500">
          {benchmarks.retrievalMode}
        </span>
      </div>

      {rentalIndex && rentalIndex.value != null && (
        <div className="mt-3 border border-zinc-800 bg-zinc-950 px-3 py-2.5">
          <div className="font-mono text-[9px] uppercase text-zinc-500">
            URA Retail Rental Index / {rentalIndex.period}
          </div>
          <div className="mt-1 flex items-end justify-between gap-2">
            <span className="font-mono text-2xl text-zinc-100">{rentalIndex.value}</span>
            <span className="text-right font-mono text-[9px] text-zinc-600">
              {rentalIndex.unit}
              <br />
              {t("marketEvidence.contextOnly")}
            </span>
          </div>
        </div>
      )}

      <div className="mt-3 space-y-1.5">
        {benchmarks.sources.map((source) => (
          <a
            key={source.id}
            href={source.url}
            target="_blank"
            rel="noreferrer"
            className="block border border-zinc-800 px-2.5 py-2 transition-colors hover:border-zinc-600"
          >
            <div className="font-mono text-[9px] uppercase text-zinc-500">
              {source.publisher}
            </div>
            <div className="mt-0.5 line-clamp-2 text-[10px] leading-4 text-zinc-300">
              {source.title}
            </div>
            <div className="mt-1 font-mono text-[9px] text-zinc-600">
              {source.dataUpdatedDate
                ? t("marketEvidence.updated", { date: source.dataUpdatedDate })
                : t("marketEvidence.referenceSource")}
            </div>
          </a>
        ))}
      </div>

      <p className="mt-3 font-mono text-[9px] uppercase leading-4 text-zinc-600">
        {t("marketEvidence.footer")}
      </p>
    </section>
  );
}
