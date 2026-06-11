"use client";

import { useState, type ReactNode } from "react";
import { BarChart3, Map, Radar, SlidersHorizontal } from "lucide-react";
import { LocaleToggle } from "@/components/shared/LocaleToggle";
import { useI18n } from "@/i18n/I18nProvider";
import type { FrontMatterReport } from "@/types/report";
import { SVGBlueprint } from "@/components/spatial/SVGBlueprint";
import { MapToggle } from "@/components/spatial/MapToggle";
import { WhatIfPanel } from "@/components/simulator/WhatIfPanel";
import { SliderControls } from "@/components/simulator/SliderControls";
import { useWhatIf } from "@/hooks/useWhatIf";
import type { AnalysisIntake } from "@/services/intakeTransfer";
import type { AgentLogEvent } from "@/types/streaming";
import { ScoreBreakdownPanel } from "./ScoreBreakdownPanel";
import { EconomicAnalysisPanel } from "./EconomicAnalysisPanel";
import { MarketEvidencePanel } from "./MarketEvidencePanel";
import { CandidateComparisonPanel } from "./CandidateComparisonPanel";
import { CalibrationPanel } from "./CalibrationPanel";
import { AgentStatusRail } from "./AgentStatusRail";

interface WorkspaceLayoutProps {
  intake: AnalysisIntake;
  report: FrontMatterReport | null;
  agentLogs: Record<string, AgentLogEvent[]>;
  status: string;
  error: string | null;
}

export function WorkspaceLayout({
  intake,
  report,
  agentLogs,
  status,
  error,
}: WorkspaceLayoutProps) {
  const { t } = useI18n();
  const [showMap, setShowMap] = useState(false);
  const [mobileView, setMobileView] = useState<"plan" | "market" | "decision" | "simulate">(
    "plan"
  );
  const occupancyCost =
    report?.financialModel.totalMonthlyOccupancyCost ??
    intake.expectedRent + intake.serviceChargeMonthly;
  const nonOccupancyCost =
    report?.financialModel.monthlyOperatingCost && report.financialModel.totalMonthlyOccupancyCost
      ? Math.max(
          report.financialModel.monthlyOperatingCost -
            report.financialModel.totalMonthlyOccupancyCost,
          0
        )
      : report?.financialModel.fixedCostNonRent ?? 2000;

  const whatIf = useWhatIf(
    {
      expectedTraffic: report?.financialModel.expectedTraffic ?? 120,
      averageSpend: report?.financialModel.averageSpend ?? 35,
      conversionRate: report?.financialModel.conversionRate ?? 0.08,
      demandBasis: report?.financialModel.demandBasis ?? "estimated_foot_traffic",
      grossMargin: report?.financialModel.grossMargin ?? 0.65,
      baseRent: occupancyCost,
      fixedCostNonRent: nonOccupancyCost,
      initialDecorationCost:
        report?.financialModel.setupCapitalRequired ??
        report?.financialModel.initialDecorationCost,
    },
    {
      expectedTraffic: report?.financialModel.expectedTraffic,
      averageSpend: report?.financialModel.averageSpend,
      baseRent: occupancyCost,
    }
  );

  return (
    <div className="h-screen flex flex-col bg-black">
      {/* Top bar */}
      <div className="h-10 border-b border-zinc-800 flex items-center px-4 shrink-0">
        <span className="font-mono text-xs text-zinc-500">
          <span className="text-white">{t("brand.name")}</span>
        </span>
        <span className="mx-2 text-zinc-700">/</span>
        <span className="hidden font-mono text-xs text-zinc-400 sm:inline">
          {intake.businessType} - {intake.squareMeters}sqm
        </span>
        <div className="ml-auto flex items-center gap-2">
          <LocaleToggle />
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="font-mono text-xs text-zinc-500">{t("workspace.live")}</span>
        </div>
      </div>

      <AgentStatusRail agentLogs={agentLogs} isComplete={status === "complete"} />

      <div className="border-b border-zinc-800 px-3 py-2 lg:hidden">
        <div className="grid grid-cols-4 gap-2">
          <MobileNavButton
            active={mobileView === "plan"}
            icon={<Map size={14} />}
            label={t("workspace.decisionPlan")}
            onClick={() => setMobileView("plan")}
          />
          <MobileNavButton
            active={mobileView === "market"}
            icon={<Radar size={14} />}
            label={t("workspace.liveMarket")}
            onClick={() => setMobileView("market")}
          />
          <MobileNavButton
            active={mobileView === "decision"}
            icon={<BarChart3 size={14} />}
            label={t("score.title")}
            onClick={() => setMobileView("decision")}
          />
          <MobileNavButton
            active={mobileView === "simulate"}
            icon={<SlidersHorizontal size={14} />}
            label={t("whatIf.title")}
            onClick={() => setMobileView("simulate")}
          />
        </div>
      </div>

      <div className="flex-1 overflow-hidden lg:hidden">
        <div className="h-full overflow-y-auto">
          {mobileView === "plan" && (
            <div className="space-y-4 p-3">
              <MobileSummary intake={intake} />
              <div className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
                <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                    {showMap ? t("workspace.liveMarket") : t("workspace.decisionPlan")}
                  </div>
                  <button
                    onClick={() => setShowMap(!showMap)}
                    className="rounded border border-zinc-700 px-2 py-1 font-mono text-[10px] text-zinc-300"
                  >
                    {showMap ? t("workspace.decisionPlan") : t("workspace.liveMarket")}
                  </button>
                </div>
                <div className="aspect-[4/5]">
                  {report && showMap ? (
                    <MapToggle mapData={report.mapData} />
                  ) : report?.spatialBlueprint ? (
                    <SVGBlueprint blueprint={report.spatialBlueprint} />
                  ) : (
                    <PendingPanel
                      message={error ? `ERROR: ${error}` : t("workspace.analyzingSpatial")}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {mobileView === "market" && (
            <div className="pb-6">
              {report ? (
                <>
                  <MarketEvidencePanel benchmarks={report.marketBenchmarks} />
                  <CandidateComparisonPanel candidates={report.candidateComparisons} />
                  <CalibrationPanel businessType={intake.businessType} report={report} />
                </>
              ) : (
                <PendingPanel
                  message={error ? `ERROR: ${error}` : t("workspace.awaitingMarketEvidence")}
                />
              )}
            </div>
          )}

          {mobileView === "decision" && (
            <div className="pb-6">
              {report ? (
                <>
                  <ScoreBreakdownPanel summary={report.summary} />
                  <EconomicAnalysisPanel analysis={report.economicAnalysis} />
                </>
              ) : (
                <PendingPanel
                  message={error ? `ERROR: ${error}` : t("workspace.awaitingDecisionOutput")}
                />
              )}
            </div>
          )}

          {mobileView === "simulate" && (
            <div className="pb-6">
              {report ? (
                <>
                  <WhatIfPanel
                    result={whatIf.result}
                    paybackMonths={whatIf.paybackMonths}
                    rentPressure={whatIf.rentPressure}
                    initialCost={
                      report.financialModel.setupCapitalRequired ||
                      report.financialModel.initialDecorationCost
                    }
                  />
                  <div className="border-t border-zinc-800">
                    <SliderControls
                      expectedTraffic={whatIf.sliders.expectedTraffic}
                      demandBasis={report.financialModel.demandBasis}
                      averageSpend={whatIf.sliders.averageSpend}
                      baseRent={whatIf.sliders.baseRent}
                      onTrafficChange={(v) => whatIf.setSlider("expectedTraffic", v)}
                      onSpendChange={(v) => whatIf.setSlider("averageSpend", v)}
                      onRentChange={(v) => whatIf.setSlider("baseRent", v)}
                      maxTraffic={500}
                      maxSpend={100}
                      maxRent={30000}
                    />
                  </div>
                </>
              ) : (
                <PendingPanel
                  message={error ? `ERROR: ${error}` : t("workspace.awaitingDecisionOutput")}
                />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="hidden flex-1 overflow-hidden lg:flex">
        {/* Left Pane: Spatial (5 cols) */}
        <div className="w-5/12 border-r border-zinc-800 relative overflow-hidden">
          {report && showMap ? (
            <MapToggle
              mapData={report.mapData}
            />
          ) : (
            <>
              {report?.spatialBlueprint ? (
                <SVGBlueprint blueprint={report.spatialBlueprint} />
              ) : (
                <div className="h-full flex items-center justify-center font-mono text-xs text-zinc-500">
                  [{t("workspace.analyzingSpatial")}]
                </div>
              )}
            </>
          )}
          <button
            onClick={() => setShowMap(!showMap)}
            className="absolute top-4 right-4 px-3 py-1.5 bg-zinc-900/95 border border-zinc-700 rounded text-xs font-mono hover:bg-zinc-800 transition-colors z-[700]"
          >
            {showMap ? t("workspace.decisionPlan") : t("workspace.liveMarket")}
          </button>
        </div>

        {/* Middle Pane: Supporting Analysis */}
        <div className="w-3/12 border-r border-zinc-800 overflow-y-auto">
          {report ? (
            <>
              <MarketEvidencePanel benchmarks={report.marketBenchmarks} />
              <CandidateComparisonPanel candidates={report.candidateComparisons} />
              <CalibrationPanel businessType={intake.businessType} report={report} />
            </>
          ) : (
            <PendingPanel
              message={error ? `ERROR: ${error}` : t("workspace.awaitingMarketEvidence")}
            />
          )}
        </div>

        {/* Right Pane: Core Decision Stack */}
        <div className="w-4/12 flex flex-col overflow-y-auto">
          {report ? (
            <>
              <ScoreBreakdownPanel summary={report.summary} />
              <EconomicAnalysisPanel analysis={report.economicAnalysis} />
              <WhatIfPanel
                result={whatIf.result}
                paybackMonths={whatIf.paybackMonths}
                rentPressure={whatIf.rentPressure}
                initialCost={
                  report.financialModel.setupCapitalRequired ||
                  report.financialModel.initialDecorationCost
                }
              />
            </>
          ) : (
            <PendingPanel
              message={error ? `ERROR: ${error}` : t("workspace.awaitingDecisionOutput")}
            />
          )}
        </div>
      </div>

      {/* Bottom: Slider Controls */}
      <div className="hidden h-24 shrink-0 border-t border-zinc-800 lg:block">
        {report && <SliderControls
          expectedTraffic={whatIf.sliders.expectedTraffic}
          demandBasis={report.financialModel.demandBasis}
          averageSpend={whatIf.sliders.averageSpend}
          baseRent={whatIf.sliders.baseRent}
          onTrafficChange={(v) => whatIf.setSlider("expectedTraffic", v)}
          onSpendChange={(v) => whatIf.setSlider("averageSpend", v)}
          onRentChange={(v) => whatIf.setSlider("baseRent", v)}
          maxTraffic={500}
          maxSpend={100}
          maxRent={30000}
        />}
      </div>
    </div>
  );
}

function PendingPanel({ message }: { message: string }) {
  return <div className="flex h-full items-center justify-center p-4 font-mono text-xs text-zinc-500">[{message}]</div>;
}

function MobileNavButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-14 flex-col items-center justify-center gap-1 rounded border px-2 ${
        active
          ? "border-lime-300/40 bg-lime-300/10 text-lime-200"
          : "border-zinc-800 bg-zinc-950 text-zinc-500"
      }`}
    >
      {icon}
      <span className="line-clamp-1 text-center font-mono text-[9px] uppercase tracking-[0.12em]">
        {label}
      </span>
    </button>
  );
}

function MobileSummary({ intake }: { intake: AnalysisIntake }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <MobileMetric label="TYPE" value={intake.businessType} />
      <MobileMetric label="SIZE" value={`${intake.squareMeters} sqm`} />
      <MobileMetric label="RENT" value={`S$${Math.round(intake.expectedRent).toLocaleString("en-SG")}`} />
      <MobileMetric label="TERM" value={`${intake.leaseTermMonths} mo`} />
    </div>
  );
}

function MobileMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-zinc-800 bg-zinc-950 px-3 py-2">
      <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-600">{label}</div>
      <div className="mt-1 text-sm text-zinc-100">{value}</div>
    </div>
  );
}
