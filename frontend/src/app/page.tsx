"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginPanel } from "@/components/auth/LoginPanel";
import { DropZone } from "@/components/intake/DropZone";
import {
  DEFAULT_INTAKE_FORM_VALUES,
  IntakeForm,
  type IntakeFormValues,
} from "@/components/intake/IntakeForm";
import { AnalyzeButton } from "@/components/intake/AnalyzeButton";
import { LocationSelector } from "@/components/intake/LocationSelector";
import {
  CandidateSitesSelector,
  type CandidateDraft,
} from "@/components/intake/CandidateSitesSelector";
import { AuthService } from "@/services/authService";
import { storePendingAnalysis } from "@/services/intakeTransfer";
import type { AnalysisIntake, SiteLocation } from "@/services/intakeTransfer";
import { useI18n } from "@/i18n/I18nProvider";
import { LocaleToggle } from "@/components/shared/LocaleToggle";

export default function IntakePage() {
  const { t } = useI18n();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formValues, setFormValues] = useState<IntakeFormValues>(
    DEFAULT_INTAKE_FORM_VALUES
  );
  const [location, setLocation] = useState<SiteLocation | null>(null);
  const [candidateSites, setCandidateSites] = useState<CandidateDraft[]>([]);

  const supportedFile =
    file !== null &&
    ["image/png", "image/jpeg", "image/webp"].includes(file.type) &&
    file.size <= 10 * 1024 * 1024;
  const canAnalyze =
    supportedFile &&
    formValues.businessType.trim() !== "" &&
    Number(formValues.expectedRent) > 0 &&
    Number(formValues.squareMeters) > 0 &&
    Number(formValues.leaseTermMonths) > 0 &&
    Number(formValues.serviceChargeMonthly) >= 0 &&
    Number(formValues.fitoutBudget) >= 0 &&
    location !== null;

  useEffect(() => {
    let active = true;
    AuthService.session()
      .then((session) => {
        if (!active) return;
        setAuthenticated(session.authenticated);
      })
      .catch(() => {
        if (!active) return;
        setAuthenticated(false);
      })
      .finally(() => {
        if (active) setAuthChecked(true);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    const intake = buildAnalysisIntake(
      formValues,
      location!,
      candidateSites,
      t("candidate.currentLocation"),
    );

    await storePendingAnalysis({
      file: file!,
      intake,
    });

    router.push("/workspace");
  };

  if (!authChecked) {
    return (
      <main className="min-h-screen blueprint-grid flex items-center justify-center p-8">
        <div className="font-mono text-xs tracking-[0.18em] text-zinc-500">
          {t("auth.checkingSession")}
        </div>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-[100dvh] blueprint-grid flex items-start justify-center p-4 pt-10 sm:items-center sm:p-8">
        <LoginPanel onSuccess={() => setAuthenticated(true)} />
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-black xl:h-screen xl:overflow-hidden">
      <div className="sticky top-0 z-30 flex min-h-12 flex-wrap items-center gap-y-1 border-b border-zinc-800 bg-black/95 px-3 py-2 backdrop-blur xl:static xl:h-10 xl:px-4 xl:py-0">
        <span className="font-mono text-xs text-zinc-500">
          <span className="text-white">{t("brand.name")}</span>
        </span>
        <span className="mx-2 text-zinc-700">/</span>
        <span className="hidden font-mono text-xs text-zinc-400 sm:inline">
          {t("intake.tagline")}
        </span>
        <div className="ml-auto">
          <LocaleToggle />
        </div>
      </div>

      <div className="flex flex-col xl:grid xl:h-[calc(100vh-2.5rem)] xl:grid-cols-[23rem_minmax(0,1fr)]">
        <aside className="flex flex-col border-b border-zinc-800 xl:min-h-0 xl:border-b-0 xl:border-r">
          <div className="border-b border-zinc-800 px-5 py-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
              Intake
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono text-zinc-500">
              <StatusBadge label="PHOTO" active={supportedFile} />
              <StatusBadge label="LOCATION" active={location !== null} />
              <StatusBadge label="BASIC" active={formValues.businessType.trim() !== ""} />
              <StatusBadge label="READY" active={canAnalyze} />
            </div>
          </div>

          <div className="space-y-4 p-4 xl:min-h-0 xl:overflow-y-auto">
            <DropZone file={file} onFileChange={setFile} />
            {file && !supportedFile && (
              <p className="text-xs font-mono text-red-500">
                {t("intake.unsupportedFile")}
              </p>
            )}
            <LocationSelector value={location} onChange={setLocation} />
            <CandidateSitesSelector candidates={candidateSites} onChange={setCandidateSites} />
          </div>
        </aside>

        <section className="flex flex-col xl:min-h-0">
          <div className="border-b border-zinc-800 px-5 py-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
              <div className="space-y-1">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
                  Analysis Intake
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-100">
                  {t("brand.name")}
                </h1>
              </div>
              <div className="grid grid-cols-1 gap-2 text-left sm:grid-cols-3 sm:text-right">
                <MetricChip
                  label={t("intake.expectedRent.label")}
                  value={formValues.expectedRent || "--"}
                />
                <MetricChip
                  label={t("intake.squareMeters.label")}
                  value={formValues.squareMeters || "--"}
                />
                <MetricChip
                  label={t("intake.leaseTermMonths.label")}
                  value={formValues.leaseTermMonths || "--"}
                />
              </div>
            </div>
          </div>

          <div className="p-4 pb-3 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:p-5">
            <IntakeForm
              values={formValues}
              onChange={(key, value) =>
                setFormValues((current) => ({ ...current, [key]: value }))
              }
            />
          </div>

          <div className="sticky bottom-0 z-20 border-t border-zinc-800 bg-black/95 px-4 py-3 backdrop-blur xl:static xl:px-5 xl:py-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="hidden min-w-0 flex-1 grid-cols-2 gap-2 sm:grid md:grid-cols-4">
                <FooterStatus
                  label={t("intake.businessType.label")}
                  value={formValues.businessType || "--"}
                />
                <FooterStatus
                  label={t("location.title")}
                  value={location ? "Verified" : "--"}
                />
                <FooterStatus
                  label={t("candidate.title")}
                  value={candidateSites.length ? String(candidateSites.length) : "0"}
                />
                <FooterStatus
                  label="Photo"
                  value={file?.name ?? "--"}
                />
              </div>
              <div className="w-full xl:max-w-xs xl:shrink-0">
                <AnalyzeButton disabled={!canAnalyze} onClick={() => void handleAnalyze()} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function StatusBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <div
      className={`rounded border px-2 py-1 ${active ? "border-lime-300/40 bg-lime-300/10 text-lime-200" : "border-zinc-800 bg-zinc-950 text-zinc-600"}`}
    >
      {label}
    </div>
  );
}

function MetricChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-zinc-800 bg-zinc-950/80 px-3 py-2">
      <div className="truncate font-mono text-[9px] uppercase tracking-[0.08em] text-zinc-600 sm:text-[10px] sm:tracking-[0.14em]">
        {label}
      </div>
      <div className="mt-1 truncate font-mono text-sm text-zinc-100">{value}</div>
    </div>
  );
}

function FooterStatus({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded border border-zinc-800 bg-zinc-950/80 px-3 py-2">
      <div className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
        {label}
      </div>
      <div className="truncate font-mono text-xs text-zinc-200">{value}</div>
    </div>
  );
}

function buildAnalysisIntake(
  values: IntakeFormValues,
  location: SiteLocation,
  candidateDrafts: CandidateDraft[],
  defaultCandidateLabel: string,
): AnalysisIntake {
  return {
    businessType: values.businessType,
    expectedRent: toRequiredNumber(values.expectedRent),
    squareMeters: toRequiredNumber(values.squareMeters),
    leaseTermMonths: toRequiredNumber(values.leaseTermMonths),
    serviceChargeMonthly: toRequiredNumber(values.serviceChargeMonthly),
    fitoutBudget: toRequiredNumber(values.fitoutBudget),
    cookingIntensity: values.cookingIntensity,
    floorPosition: values.floorPosition,
    layoutShape: values.layoutShape,
    hasWaterSupply: values.hasWaterSupply,
    hasFloorTrap: values.hasFloorTrap,
    hasGreaseTrap: values.hasGreaseTrap,
    electricalReadiness: values.electricalReadiness,
    hasGas: values.hasGas,
    hasExhaust: values.hasExhaust,
    wastewaterReadiness: values.wastewaterReadiness,
    approvedUseStatus: values.approvedUseStatus,
    rentFreeMonths: toOptionalNumber(values.rentFreeMonths),
    depositMonths: toOptionalNumber(values.depositMonths),
    otherMonthlyCosts: toOptionalNumber(values.otherMonthlyCosts),
    utilitiesMonthlyEstimate: toOptionalNumber(values.utilitiesMonthlyEstimate),
    staffingMonthly: toOptionalNumber(values.staffingMonthly),
    marketingMonthly: toOptionalNumber(values.marketingMonthly),
    insuranceMonthly: toOptionalNumber(values.insuranceMonthly),
    licenseFees: toOptionalNumber(values.licenseFees),
    reinstatementCost: toOptionalNumber(values.reinstatementCost),
    annualRentEscalation: toOptionalNumber(values.annualRentEscalation),
    annualRevenueGrowth: toOptionalNumber(values.annualRevenueGrowth),
    turnoverRentRate: toOptionalNumber(values.turnoverRentRate),
    openingRampMonths: toOptionalNumber(values.openingRampMonths),
    discountRateAnnual: toOptionalNumber(values.discountRateAnnual),
    expectedDailyCustomers: toOptionalNumber(values.expectedDailyCustomers),
    averageSpend: toOptionalNumber(values.averageSpend),
    grossMargin: toOptionalNumber(values.grossMargin),
    frontageWidthM: toOptionalNumber(values.frontageWidthM),
    ceilingHeightM: toOptionalNumber(values.ceilingHeightM),
    usableAreaRatio: toOptionalNumber(values.usableAreaRatio),
    storageAreaSqm: toOptionalNumber(values.storageAreaSqm),
    seatingCapacity: toOptionalNumber(values.seatingCapacity),
    loadingAccess: values.loadingAccess,
    toiletAccess: values.toiletAccess,
    signageVisibility: values.signageVisibility,
    exhaustRouteAvailable: values.exhaustRouteAvailable,
    location,
    candidateSites: candidateDrafts.flatMap((candidate) => {
      const monthlyRent = Number(candidate.monthlyRent);
      if (!candidate.location || !Number.isFinite(monthlyRent) || monthlyRent <= 0) {
        return [];
      }
      return [
        {
          label: candidate.location.siteLabel ?? defaultCandidateLabel,
          monthlyRent,
          latitude: candidate.location.latitude,
          longitude: candidate.location.longitude,
        },
      ];
    }),
  };
}

function toRequiredNumber(value: string): number {
  return Number(value);
}

function toOptionalNumber(value: string): number | undefined {
  if (value.trim() === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}
