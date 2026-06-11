"use client";

import { Plus, X } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { LocationSelector } from "./LocationSelector";
import type { SiteLocation } from "@/services/intakeTransfer";

export interface CandidateDraft {
  monthlyRent: string;
  location: SiteLocation | null;
}

interface CandidateSitesSelectorProps {
  candidates: CandidateDraft[];
  onChange: (candidates: CandidateDraft[]) => void;
}

export function CandidateSitesSelector({
  candidates,
  onChange,
}: CandidateSitesSelectorProps) {
  const { t } = useI18n();
  function addCandidate() {
    if (candidates.length >= 3) return;
    onChange([...candidates, { monthlyRent: "", location: null }]);
  }

  function updateCandidate(index: number, update: Partial<CandidateDraft>) {
    onChange(
      candidates.map((candidate, candidateIndex) =>
        candidateIndex === index ? { ...candidate, ...update } : candidate
      )
    );
  }

  return (
    <section className="rounded-lg border border-zinc-800 p-3 sm:p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
            {t("candidate.title")}
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {t("candidate.subtitle")}
          </p>
        </div>
        <button
          type="button"
          disabled={candidates.length >= 3}
          onClick={addCandidate}
          className="inline-flex min-h-10 items-center justify-center gap-1 rounded border border-zinc-700 px-3 py-2 font-mono text-[10px] uppercase text-zinc-300 disabled:opacity-40 sm:self-start"
        >
          <Plus size={12} />
          {t("candidate.addSite")}
        </button>
      </div>

      <div className="mt-3 space-y-3">
        {candidates.map((candidate, index) => (
          <div key={index} className="space-y-3 rounded border border-zinc-800 bg-zinc-950 p-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase text-zinc-500">
                {t("candidate.option", { index: index + 1 })}
              </span>
              <button
                type="button"
                aria-label={t("candidate.remove", { index: index + 1 })}
                onClick={() =>
                  onChange(candidates.filter((_, candidateIndex) => candidateIndex !== index))
                }
                className="rounded p-2 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200"
              >
                <X size={13} />
              </button>
            </div>
            <label className="block space-y-2">
              <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
                {t("candidate.monthlyRent")}
              </span>
              <input
                type="number"
                min="1"
                value={candidate.monthlyRent}
                placeholder="5000"
                onChange={(event) =>
                  updateCandidate(index, { monthlyRent: event.target.value })
                }
                className="h-11 w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-base text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none sm:text-sm"
              />
            </label>
            <LocationSelector
              value={candidate.location}
              onChange={(location) => updateCandidate(index, { location })}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
