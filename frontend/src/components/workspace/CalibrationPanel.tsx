"use client";

import { useEffect, useMemo, useState } from "react";
import { CalibrationService } from "@/services/calibrationService";
import type { LeaseLensReport } from "@/types/report";
import type { ActualOutcome, CalibrationSummary } from "@/types/calibration";

interface CalibrationPanelProps {
  businessType: string;
  report: LeaseLensReport;
}

export function CalibrationPanel({ businessType, report }: CalibrationPanelProps) {
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
      setStatus("ENTER ACTUAL MONTHLY PROFIT");
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
      setStatus("OUTCOME RECORDED LOCALLY");
    } catch {
      setStatus("OUTCOME SAVE UNAVAILABLE");
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
      link.download = "leaselens-anonymous-outcomes.json";
      link.click();
      URL.revokeObjectURL(downloadUrl);
      setStatus("ANONYMOUS DATASET EXPORTED");
    } catch {
      setStatus("EXPORT UNAVAILABLE");
    }
  }

  async function importDataset(file: File | null) {
    if (!file) return;
    try {
      const dataset = JSON.parse(await file.text());
      await CalibrationService.importDataset(dataset);
      setSummary(await CalibrationService.summary());
      setStatus("ANONYMOUS DATASET IMPORTED");
    } catch {
      setStatus("IMPORT REJECTED");
    }
  }

  return (
    <section className="border-b border-zinc-800 p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        Outcome Calibration
      </div>
      <p className="mt-1 text-[10px] leading-4 text-zinc-500">
        Record actual results locally. Exports contain economic outcomes only, without address or
        image data.
      </p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <input
          type="number"
          value={actualProfit}
          onChange={(event) => setActualProfit(event.target.value)}
          placeholder="Actual profit / mo"
          className="col-span-2 border border-zinc-800 bg-black px-2.5 py-2 font-mono text-[11px] text-zinc-200 placeholder:text-zinc-600"
        />
        <select
          value={outcome}
          onChange={(event) => setOutcome(event.target.value as ActualOutcome)}
          className="col-span-2 border border-zinc-800 bg-black px-2.5 py-2 font-mono text-[10px] text-zinc-300"
        >
          <option value="operating_profitable">Operating profitable</option>
          <option value="operating_unprofitable">Operating unprofitable</option>
          <option value="abandoned_before_opening">Abandoned before opening</option>
          <option value="closed">Closed</option>
        </select>
        <button type="button" onClick={recordOutcome} className={buttonClassName}>
          Record
        </button>
        <button type="button" onClick={exportDataset} className={buttonClassName}>
          Export JSON
        </button>
        <label className={`${buttonClassName} col-span-2 cursor-pointer text-center`}>
          Import Anonymous JSON
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
          SAMPLE {summary.sampleSize}/{summary.minimumSampleSize} REQUIRED
          {summary.status === "available" && summary.meanAbsoluteMonthlyProfitError != null && (
            <div className="mt-1 text-zinc-300">
              MEAN ABS PROFIT ERROR S${summary.meanAbsoluteMonthlyProfitError.toLocaleString()}
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
