"use client";

import { useEffect, useState } from "react";
import { Crosshair, MapPin, Search } from "lucide-react";
import { isWithinSingapore } from "@/lib/singapore";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/I18nProvider";
import { isUnauthorizedError } from "@/services/authService";
import { LocationService, type LocationPrediction } from "@/services/locationService";
import type { SiteLocation } from "@/services/intakeTransfer";

interface LocationSelectorProps {
  value: SiteLocation | null;
  onChange: (value: SiteLocation | null) => void;
}

function createSessionToken() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export function LocationSelector({ value, onChange }: LocationSelectorProps) {
  const { t } = useI18n();
  const [mode, setMode] = useState<"current" | "address">("current");
  const [query, setQuery] = useState("");
  const [predictions, setPredictions] = useState<LocationPrediction[]>([]);
  const [sessionToken, setSessionToken] = useState(createSessionToken);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canSearchAddress =
    mode === "address" && query.trim().length >= 2 && value?.mode !== "address";
  const visiblePredictions = canSearchAddress ? predictions : [];

  useEffect(() => {
    if (!canSearchAddress) {
      return;
    }
    const timeout = window.setTimeout(async () => {
      setPending(true);
      setError(null);
      try {
        setPredictions(await LocationService.autocomplete(query.trim(), sessionToken));
      } catch (err) {
        if (isUnauthorizedError(err)) {
          setError(t("location.error.sessionExpired"));
          window.location.assign("/");
          return;
        }
        setError(t("location.error.unavailable"));
      } finally {
        setPending(false);
      }
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [canSearchAddress, query, sessionToken, t]);

  function switchMode(nextMode: "current" | "address") {
    setMode(nextMode);
    onChange(null);
    setError(null);
    setPredictions([]);
    setQuery("");
    setSessionToken(createSessionToken());
  }

  function locateCurrentSite() {
    setPending(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        if (!isWithinSingapore(coords.latitude, coords.longitude)) {
          setError(t("location.error.unsupportedRegion"));
          setPending(false);
          return;
        }
        onChange({ mode: "current", latitude: coords.latitude, longitude: coords.longitude });
        setPending(false);
      },
      () => {
        setError(t("location.error.permissionDenied"));
        setPending(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function choosePrediction(prediction: LocationPrediction) {
    setPending(true);
    setError(null);
    try {
      const resolved = await LocationService.resolve(prediction.placeId, sessionToken);
      onChange(resolved);
      setQuery(resolved.siteLabel ?? prediction.text);
      setPredictions([]);
    } catch (err) {
      if (isUnauthorizedError(err)) {
        setError(t("location.error.sessionExpired"));
        window.location.assign("/");
        return;
      }
      setError(t("location.error.resolve"));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.18em] text-zinc-500">{t("location.title")}</span>
        {value && <span className="font-mono text-[10px] text-lime-300">{t("location.verified")}</span>}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => switchMode("current")}
          className={cn(
            "flex min-h-11 min-w-0 items-center justify-center gap-2 rounded border px-2 py-2 font-mono text-[11px] sm:px-3 sm:text-xs",
            mode === "current" ? "border-lime-300 text-lime-200 bg-lime-300/5" : "border-zinc-800 text-zinc-500"
          )}
        >
          <Crosshair className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{t("location.currentMode")}</span>
        </button>
        <button
          type="button"
          onClick={() => switchMode("address")}
          className={cn(
            "flex min-h-11 min-w-0 items-center justify-center gap-2 rounded border px-2 py-2 font-mono text-[11px] sm:px-3 sm:text-xs",
            mode === "address" ? "border-lime-300 text-lime-200 bg-lime-300/5" : "border-zinc-800 text-zinc-500"
          )}
        >
          <Search className="h-3.5 w-3.5 shrink-0" /> <span className="truncate">{t("location.addressMode")}</span>
        </button>
      </div>
      {mode === "current" ? (
        <div className="space-y-3">
          <p className="text-xs leading-relaxed text-zinc-500">
            {t("location.currentHint")}
          </p>
          <button
            type="button"
            disabled={pending}
            onClick={locateCurrentSite}
            className="min-h-11 w-full rounded border border-zinc-700 px-3 py-2 font-mono text-xs hover:border-lime-300 disabled:opacity-50"
          >
            {pending
              ? t("location.locating")
              : value?.mode === "current"
                ? t("location.locationConfirmed")
                : t("location.authorizeLocation")}
          </button>
        </div>
      ) : (
        <div className="relative space-y-2">
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              onChange(null);
            }}
            placeholder={t("location.searchPlaceholder")}
            className="h-11 w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 font-mono text-base focus:border-zinc-600 focus:outline-none sm:text-sm"
          />
          {visiblePredictions.length > 0 && (
            <div className="absolute top-full z-20 w-full border border-zinc-700 bg-zinc-950 shadow-xl">
              {visiblePredictions.map((prediction) => (
                <button
                  type="button"
                  key={prediction.placeId}
                  onClick={() => choosePrediction(prediction)}
                  className="flex w-full items-start gap-2 border-b border-zinc-800 p-3 text-left text-xs text-zinc-300 hover:bg-zinc-900"
                >
                  <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-lime-300" />
                  {prediction.text}
                </button>
              ))}
            </div>
          )}
          <p className="text-[11px] text-zinc-500">
            {t("location.searchHint")}
          </p>
          <p className="text-[11px] text-zinc-600">{t("location.singaporeOnlyHint")}</p>
        </div>
      )}
      {error && <p className="font-mono text-xs text-red-400">{error}</p>}
    </section>
  );
}
