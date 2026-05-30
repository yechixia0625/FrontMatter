"use client";

import { useI18n } from "@/i18n/I18nProvider";
import type { Locale } from "@/i18n/messages";
import { cn } from "@/lib/utils";

const LOCALES: Locale[] = ["en", "zh"];

export function LocaleToggle() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div className="inline-flex items-center rounded border border-zinc-800 bg-zinc-950/80 p-1">
      {LOCALES.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setLocale(option)}
          className={cn(
            "px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors",
            locale === option
              ? "bg-white text-black"
              : "text-zinc-500 hover:text-zinc-200",
          )}
          aria-pressed={locale === option}
        >
          {option === "en" ? t("locale.english") : t("locale.chinese")}
        </button>
      ))}
    </div>
  );
}
