"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";

export function HackerLoading() {
  const { t } = useI18n();
  const loadingLines = useMemo(
    () => [
      t("loading.initSpatial"),
      t("loading.connectingEngine"),
      t("loading.loadingFinance"),
      t("loading.scanningCompetition"),
      t("loading.preparingBlueprints"),
      t("loading.calibratingZones"),
      t("loading.syncingPipeline"),
      t("loading.ready"),
    ],
    [t],
  );
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= loadingLines.length) return;

    const timer = setTimeout(
      () => {
        setLines((prev) => [...prev, loadingLines[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      },
      200 + Math.random() * 300
    );

    return () => clearTimeout(timer);
  }, [currentIndex, loadingLines]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-xl font-mono text-sm space-y-1">
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              i === loadingLines.length - 1
                ? "text-white font-bold"
                : "text-zinc-500"
            }
          >
            {line}
          </div>
        ))}
        {currentIndex < loadingLines.length && (
          <span className="inline-block w-2 h-4 bg-white terminal-cursor" />
        )}
      </div>
    </div>
  );
}
