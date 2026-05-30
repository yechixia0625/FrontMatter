"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { CalibrationService } from "@/services/calibrationService";
import type { FrontMatterReport } from "@/types/report";
import type { ActualOutcome, CalibrationSummary } from "@/types/calibration";

interface CalibrationPanelProps {
  businessType: string;
  report: FrontMatterReport;
}

export function CalibrationPanel({ businessType, report }: CalibrationPanelProps) {
  const { t } = useI18n();
  const [actualProfit, setActualProfit] = useState("");
  const [outcome, setOutcome] = useState<ActualOutcome>("operating_profitable");
  const [summary, setSummary] = useState<CalibrationSummary | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const predictedMonthlyProfit = useMemo(() => {
    const operatingRows = report.economicAnalysis.cashFlows.filter((cashFlow) => cashFlow.month > 0);
    return (
      operatingRows.reduce((total, cashFlow) => total + cashFlow.netCashFlow, 0) /
      Math.max(operatingRows.length, 1)
    );
  }, [report.economicAnalysis.cashFlows]);

  useEffect(() => {
    CalibrationService.summary().then(setSummary).catch(() => setSummary(null));
  }, []);

  async function recordOutcome() {
    const actualMonthlyNetProfit = Number(actualProfit);
    if (!Number.isFinite(actualMonthlyNetProfit)) {
      setStatus(t("calibration.status.enterActualProfit"));
      return;
    }
    try {
      await CalibrationService.recordOutcome({
        modelVersion: "dcf-v1",
        businessType,
        predictedNpv: report.economicAnalysis.npv,
        predictedMonthlyNetProfit: predictedMonthlyProfit,
        predictedVerdict: report.summary.verdict,
        actualMonthlyNetProfit,
        actualOutcome: outcome,
      });
      setSummary(await CalibrationService.summary());
      setStatus(t("calibration.status.recorded"));
    } catch {
      setStatus(t("calibration.status.saveUnavailable"));
    }
  }

  async function exportDataset() {
    try {
      const dataset = await CalibrationService.exportDataset();
      const downloadUrl = URL.createObjectURL(
        new Blob([JSON.stringify(dataset, null, 2)], { type: "application/json" })
      );
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "frontmatter-anonymous-outcomes.json";
      link.click();
      URL.revokeObjectURL(downloadUrl);
      setStatus(t("calibration.status.exported"));
    } catch {
      setStatus(t("calibration.status.exportUnavailable"));
    }
  }

  async function importDataset(file: File | null) {
    if (!file) return;
    try {
      const dataset = JSON.parse(await file.text());
      await CalibrationService.importDataset(dataset);
      setSummary(await CalibrationService.summary());
      setStatus(t("calibration.status.imported"));
    } catch {
      setStatus(t("calibration.status.importRejected"));
    }
  }

  return (
    <section className="border-b border-zinc-800 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        {t("calibration.title")}
      </div>
      <p className="mt-1 text-[10px] leading-4 text-zinc-500">
        {t("calibration.subtitle")}
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <input
          type="number"
          value={actualProfit}
          onChange={(event) => setActualProfit(event.target.value)}
          placeholder={t("calibration.actualProfitPlaceholder")}
          className="col-span-2 border border-zinc-800 bg-black px-2.5 py-2 font-mono text-[11px] text-zinc-200 placeholder:text-zinc-600"
        />
        <select
          value={outcome}
          onChange={(event) => setOutcome(event.target.value as ActualOutcome)}
          className="col-span-2 border border-zinc-800 bg-black px-2.5 py-2 font-mono text-[10px] text-zinc-300"
        >
          <option value="operating_profitable">{t("calibration.outcome.profitable")}</option>
          <option value="operating_unprofitable">{t("calibration.outcome.unprofitable")}</option>
          <option value="abandoned_before_opening">{t("calibration.outcome.abandoned")}</option>
          <option value="closed">{t("calibration.outcome.closed")}</option>
        </select>
        <button type="button" onClick={recordOutcome} className={buttonClassName}>
          {t("calibration.record")}
        </button>
        <button type="button" onClick={exportDataset} className={buttonClassName}>
          {t("calibration.export")}
        </button>
        <label className={`${buttonClassName} col-span-2 cursor-pointer text-center`}>
          {t("calibration.import")}
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(event) => importDataset(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      {summary && (
        <div className="mt-3 border border-zinc-800 px-2.5 py-2 font-mono text-[10px] text-zinc-500">
          {t("calibration.sample", {
            current: summary.sampleSize,
            required: summary.minimumSampleSize,
          })}
          {summary.status === "available" && summary.meanAbsoluteMonthlyProfitError != null && (
            <div className="mt-1 text-zinc-300">
              {t("calibration.meanError", {
                value: summary.meanAbsoluteMonthlyProfitError.toLocaleString(),
              })}
            </div>
          )}
        </div>
      )}
      {status && <div className="mt-2 font-mono text-[9px] uppercase text-zinc-500">{status}</div>}
    </section>
  );
}

const buttonClassName =
  "border border-zinc-800 px-2 py-2 font-mono text-[9px] uppercase text-zinc-400 hover:border-zinc-600 hover:text-zinc-200";
