"use client";

import { ArrowRight } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

interface AnalyzeButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export function AnalyzeButton({ disabled, onClick }: AnalyzeButtonProps) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex min-h-12 w-full items-center justify-center gap-2 rounded font-mono text-sm uppercase tracking-[0.12em] transition-all sm:tracking-wider",
        disabled
          ? "bg-zinc-900 text-zinc-600 cursor-not-allowed"
          : "bg-white text-black hover:bg-zinc-200 active:scale-[0.98]"
      )}
    >
      <span>{t("intake.analyze")}</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
