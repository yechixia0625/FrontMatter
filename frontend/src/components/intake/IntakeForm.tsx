"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import type {
  ApprovedUseStatus,
  CookingIntensity,
  FloorPosition,
  LayoutShape,
  Readiness,
} from "@/services/intakeTransfer";

export interface IntakeFormValues {
  businessType: string;
  expectedRent: string;
  squareMeters: string;
  leaseTermMonths: string;
  serviceChargeMonthly: string;
  fitoutBudget: string;
  cookingIntensity: CookingIntensity;
  floorPosition: FloorPosition;
  layoutShape: LayoutShape;
  hasWaterSupply: Readiness;
  hasFloorTrap: Readiness;
  hasGreaseTrap: Readiness;
  electricalReadiness: Readiness;
  hasGas: Readiness;
  hasExhaust: Readiness;
  wastewaterReadiness: Readiness;
  approvedUseStatus: ApprovedUseStatus;
  rentFreeMonths: string;
  depositMonths: string;
  otherMonthlyCosts: string;
  utilitiesMonthlyEstimate: string;
  staffingMonthly: string;
  marketingMonthly: string;
  insuranceMonthly: string;
  licenseFees: string;
  reinstatementCost: string;
  annualRentEscalation: string;
  annualRevenueGrowth: string;
  turnoverRentRate: string;
  openingRampMonths: string;
  discountRateAnnual: string;
  expectedDailyCustomers: string;
  averageSpend: string;
  grossMargin: string;
  frontageWidthM: string;
  ceilingHeightM: string;
  usableAreaRatio: string;
  storageAreaSqm: string;
  seatingCapacity: string;
  loadingAccess: Readiness;
  toiletAccess: Readiness;
  signageVisibility: Readiness;
  exhaustRouteAvailable: Readiness;
}

export const DEFAULT_INTAKE_FORM_VALUES: IntakeFormValues = {
  businessType: "",
  expectedRent: "",
  squareMeters: "",
  leaseTermMonths: "36",
  serviceChargeMonthly: "0",
  fitoutBudget: "60000",
  cookingIntensity: "light",
  floorPosition: "ground",
  layoutShape: "regular",
  hasWaterSupply: "unknown",
  hasFloorTrap: "unknown",
  hasGreaseTrap: "unknown",
  electricalReadiness: "unknown",
  hasGas: "unknown",
  hasExhaust: "unknown",
  wastewaterReadiness: "unknown",
  approvedUseStatus: "unknown",
  rentFreeMonths: "",
  depositMonths: "",
  otherMonthlyCosts: "",
  utilitiesMonthlyEstimate: "",
  staffingMonthly: "",
  marketingMonthly: "",
  insuranceMonthly: "",
  licenseFees: "",
  reinstatementCost: "",
  annualRentEscalation: "0",
  annualRevenueGrowth: "0",
  turnoverRentRate: "0",
  openingRampMonths: "3",
  discountRateAnnual: "0.08",
  expectedDailyCustomers: "",
  averageSpend: "",
  grossMargin: "",
  frontageWidthM: "",
  ceilingHeightM: "",
  usableAreaRatio: "",
  storageAreaSqm: "",
  seatingCapacity: "",
  loadingAccess: "unknown",
  toiletAccess: "unknown",
  signageVisibility: "unknown",
  exhaustRouteAvailable: "unknown",
};

interface IntakeFormProps {
  values: IntakeFormValues;
  onChange: <K extends keyof IntakeFormValues>(
    key: K,
    value: IntakeFormValues[K]
  ) => void;
}

export function IntakeForm({ values, onChange }: IntakeFormProps) {
  const { t } = useI18n();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  return (
    <div className="space-y-4">
      <section className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
        <SectionLabel>{t("intake.basic")}</SectionLabel>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
          <TextField
            label={t("intake.businessType.label")}
            placeholder={t("intake.businessType.placeholder")}
            value={values.businessType}
            onChange={(value) => onChange("businessType", value)}
          />
          <NumberField
            label={t("intake.expectedRent.label")}
            placeholder="5000"
            value={values.expectedRent}
            onChange={(value) => onChange("expectedRent", value)}
          />
          <NumberField
            label={t("intake.squareMeters.label")}
            placeholder="80"
            value={values.squareMeters}
            onChange={(value) => onChange("squareMeters", value)}
          />
          <NumberField
            label={t("intake.leaseTermMonths.label")}
            placeholder="36"
            value={values.leaseTermMonths}
            onChange={(value) => onChange("leaseTermMonths", value)}
          />
          <NumberField
            label={t("intake.serviceChargeMonthly.label")}
            placeholder="0"
            value={values.serviceChargeMonthly}
            onChange={(value) => onChange("serviceChargeMonthly", value)}
          />
          <NumberField
            label={t("intake.fitoutBudget.label")}
            placeholder="60000"
            value={values.fitoutBudget}
            onChange={(value) => onChange("fitoutBudget", value)}
          />
        </div>
      </section>

      <section className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
        <SectionLabel>{t("intake.fnbReadiness")}</SectionLabel>
        <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
          <Segmented
            label={t("intake.cooking.label")}
            value={values.cookingIntensity}
            options={[
              ["none", t("intake.cooking.none")],
              ["light", t("intake.cooking.light")],
              ["full", t("intake.cooking.full")],
            ]}
            onChange={(value) => onChange("cookingIntensity", value)}
          />
          <SelectField
            label={t("intake.floor.label")}
            value={values.floorPosition}
            options={[
              ["basement", t("intake.floor.basement")],
              ["ground", t("intake.floor.ground")],
              ["upper", t("intake.floor.upper")],
              ["mall", t("intake.floor.mall")],
              ["unknown", t("intake.floor.unknown")],
            ]}
            onChange={(value) => onChange("floorPosition", value)}
          />
          <SelectField
            label={t("intake.layout.label")}
            value={values.layoutShape}
            options={[
              ["regular", t("intake.layout.regular")],
              ["narrow", t("intake.layout.narrow")],
              ["corner", t("intake.layout.corner")],
              ["irregular", t("intake.layout.irregular")],
              ["unknown", t("intake.layout.unknown")],
            ]}
            onChange={(value) => onChange("layoutShape", value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          <ReadinessRow
            label={t("intake.readiness.water")}
            value={values.hasWaterSupply}
            onChange={(value) => onChange("hasWaterSupply", value)}
          />
          <ReadinessRow
            label={t("intake.readiness.power")}
            value={values.electricalReadiness}
            onChange={(value) => onChange("electricalReadiness", value)}
          />
          <ReadinessRow
            label={t("intake.readiness.gas")}
            value={values.hasGas}
            onChange={(value) => onChange("hasGas", value)}
          />
          <ReadinessRow
            label={t("intake.readiness.floorTrap")}
            value={values.hasFloorTrap}
            onChange={(value) => onChange("hasFloorTrap", value)}
          />
          <ReadinessRow
            label={t("intake.readiness.greaseTrap")}
            value={values.hasGreaseTrap}
            onChange={(value) => onChange("hasGreaseTrap", value)}
          />
          <ReadinessRow
            label={t("intake.readiness.exhaust")}
            value={values.hasExhaust}
            onChange={(value) => onChange("hasExhaust", value)}
          />
          <ReadinessRow
            label={t("intake.readiness.wastewater")}
            value={values.wastewaterReadiness}
            onChange={(value) => onChange("wastewaterReadiness", value)}
          />
          <Segmented
            label={t("intake.approvedUse.label")}
            value={values.approvedUseStatus}
            options={[
              ["confirmed", t("intake.approvedUse.confirmed")],
              ["unknown", t("intake.approvedUse.unknown")],
              ["needs_change_of_use", t("intake.approvedUse.change")],
            ]}
            onChange={(value) => onChange("approvedUseStatus", value)}
          />
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950/70">
        <button
          type="button"
          onClick={() => setAdvancedOpen((open) => !open)}
          className="flex w-full items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500"
        >
          {t("intake.advanced")}
          <ChevronDown
            size={14}
            className={cn("transition-transform", advancedOpen && "rotate-180")}
          />
        </button>
        {advancedOpen && (
          <div className="grid grid-cols-1 gap-3 border-t border-zinc-800 p-4 md:grid-cols-2 2xl:grid-cols-3">
            <NumberField
              label={t("intake.rentFree.label")}
              placeholder="2"
              value={values.rentFreeMonths}
              onChange={(value) => onChange("rentFreeMonths", value)}
            />
            <NumberField
              label={t("intake.deposit.label")}
              placeholder="3"
              value={values.depositMonths}
              onChange={(value) => onChange("depositMonths", value)}
            />
            <NumberField
              label={t("intake.otherCosts.label")}
              placeholder="1200"
              value={values.otherMonthlyCosts}
              onChange={(value) => onChange("otherMonthlyCosts", value)}
            />
            <NumberField
              label={t("intake.utilities.label")}
              placeholder="900"
              value={values.utilitiesMonthlyEstimate}
              onChange={(value) => onChange("utilitiesMonthlyEstimate", value)}
            />
            <NumberField
              label={t("intake.staffing.label")}
              placeholder="12000"
              value={values.staffingMonthly}
              onChange={(value) => onChange("staffingMonthly", value)}
            />
            <NumberField
              label={t("intake.marketing.label")}
              placeholder="700"
              value={values.marketingMonthly}
              onChange={(value) => onChange("marketingMonthly", value)}
            />
            <NumberField
              label={t("intake.insurance.label")}
              placeholder="250"
              value={values.insuranceMonthly}
              onChange={(value) => onChange("insuranceMonthly", value)}
            />
            <NumberField
              label={t("intake.licenseFees.label")}
              placeholder="900"
              value={values.licenseFees}
              onChange={(value) => onChange("licenseFees", value)}
            />
            <NumberField
              label={t("intake.reinstatement.label")}
              placeholder="15000"
              value={values.reinstatementCost}
              onChange={(value) => onChange("reinstatementCost", value)}
            />
            <NumberField
              label={t("intake.rentEscalation.label")}
              placeholder="0.03"
              value={values.annualRentEscalation}
              step="0.01"
              onChange={(value) => onChange("annualRentEscalation", value)}
            />
            <NumberField
              label={t("intake.revenueGrowth.label")}
              placeholder="0.02"
              value={values.annualRevenueGrowth}
              min="-1"
              step="0.01"
              onChange={(value) => onChange("annualRevenueGrowth", value)}
            />
            <NumberField
              label={t("intake.turnoverRentRate.label")}
              placeholder="0.02"
              value={values.turnoverRentRate}
              step="0.01"
              onChange={(value) => onChange("turnoverRentRate", value)}
            />
            <NumberField
              label={t("intake.openingRampMonths.label")}
              placeholder="3"
              value={values.openingRampMonths}
              onChange={(value) => onChange("openingRampMonths", value)}
            />
            <NumberField
              label={t("intake.discountRate.label")}
              placeholder="0.08"
              value={values.discountRateAnnual}
              step="0.01"
              onChange={(value) => onChange("discountRateAnnual", value)}
            />
            <NumberField
              label={t("intake.dailyCustomers.label")}
              placeholder="140"
              value={values.expectedDailyCustomers}
              onChange={(value) => onChange("expectedDailyCustomers", value)}
            />
            <NumberField
              label={t("intake.averageSpend.label")}
              placeholder="18"
              value={values.averageSpend}
              onChange={(value) => onChange("averageSpend", value)}
            />
            <NumberField
              label={t("intake.grossMargin.label")}
              placeholder="0.68"
              value={values.grossMargin}
              step="0.01"
              onChange={(value) => onChange("grossMargin", value)}
            />
            <NumberField
              label={t("intake.frontage.label")}
              placeholder="6"
              value={values.frontageWidthM}
              step="0.1"
              onChange={(value) => onChange("frontageWidthM", value)}
            />
            <NumberField
              label={t("intake.ceiling.label")}
              placeholder="3.2"
              value={values.ceilingHeightM}
              step="0.1"
              onChange={(value) => onChange("ceilingHeightM", value)}
            />
            <NumberField
              label={t("intake.usableRatio.label")}
              placeholder="0.78"
              value={values.usableAreaRatio}
              step="0.01"
              onChange={(value) => onChange("usableAreaRatio", value)}
            />
            <NumberField
              label={t("intake.storage.label")}
              placeholder="8"
              value={values.storageAreaSqm}
              onChange={(value) => onChange("storageAreaSqm", value)}
            />
            <NumberField
              label={t("intake.seats.label")}
              placeholder="32"
              value={values.seatingCapacity}
              onChange={(value) => onChange("seatingCapacity", value)}
            />
            <ReadinessRow
              label={t("intake.readiness.loading")}
              value={values.loadingAccess}
              onChange={(value) => onChange("loadingAccess", value)}
            />
            <ReadinessRow
              label={t("intake.readiness.toilet")}
              value={values.toiletAccess}
              onChange={(value) => onChange("toiletAccess", value)}
            />
            <ReadinessRow
              label={t("intake.readiness.signage")}
              value={values.signageVisibility}
              onChange={(value) => onChange("signageVisibility", value)}
            />
            <ReadinessRow
              label={t("intake.readiness.exhaustRoute")}
              value={values.exhaustRouteAvailable}
              onChange={(value) => onChange("exhaustRouteAvailable", value)}
            />
          </div>
        )}
      </section>
    </div>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
      {children}
    </div>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
}

function TextField({ label, value, placeholder, onChange }: TextFieldProps) {
  return (
    <FieldShell label={label}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </FieldShell>
  );
}

interface NumberFieldProps extends TextFieldProps {
  step?: string;
  min?: string;
}

function NumberField({ label, value, placeholder, step, min = "0", onChange }: NumberFieldProps) {
  return (
    <FieldShell label={label}>
      <input
        type="number"
        min={min}
        step={step}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </FieldShell>
  );
}

interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: Array<[T, string]>;
  onChange: (value: T) => void;
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: SelectFieldProps<T>) {
  return (
    <FieldShell label={label}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
        className={inputClassName}
      >
        {options.map(([optionValue, text]) => (
          <option key={optionValue} value={optionValue}>
            {text}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function FieldShell({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2">
      <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClassName = cn(
  "h-10 w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm",
  "font-mono text-zinc-100 placeholder:text-zinc-600",
  "focus:border-zinc-600 focus:outline-none"
);

interface SegmentedProps<T extends string> {
  label: string;
  value: T;
  options: Array<[T, string]>;
  onChange: (value: T) => void;
}

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: SegmentedProps<T>) {
  return (
    <div className="space-y-2">
      <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
        {label}
      </span>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(0,1fr))] overflow-hidden rounded border border-zinc-800">
        {options.map(([optionValue, text]) => (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={cn(
              "min-w-0 border-r border-zinc-800 px-2 py-2 font-mono text-[10px]",
              "uppercase text-zinc-500 last:border-r-0 hover:text-zinc-200",
              value === optionValue && "bg-lime-300/10 text-lime-200"
            )}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}

function ReadinessRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Readiness;
  onChange: (value: Readiness) => void;
}) {
  const { t } = useI18n();
  return (
    <Segmented
      label={label}
      value={value}
      options={[
        ["yes", t("intake.readiness.yes")],
        ["unknown", t("intake.approvedUse.unknown")],
        ["no", t("intake.readiness.no")],
      ]}
      onChange={onChange}
    />
  );
}
