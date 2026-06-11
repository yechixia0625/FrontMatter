"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { useI18n } from "@/i18n/I18nProvider";
import type { MapData, Competitor } from "@/types/map";
import { DARK_TILES_ATTRIBUTION, DARK_TILES_URL, DEFAULT_MAP_ZOOM } from "@/lib/map-tiles";

interface LeafletMapProps {
  mapData: MapData;
}

function markerColor(proximityLevel: Competitor["proximityLevel"]): string {
  if (proximityLevel === "HIGH") return "#e16855";
  if (proximityLevel === "MEDIUM") return "#e4bb63";
  return "#79a984";
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"]/g, (char) => {
    if (char === "&") return "&amp;";
    if (char === "<") return "&lt;";
    if (char === ">") return "&gt;";
    return "&quot;";
  });
}

export default function LeafletMap({ mapData }: LeafletMapProps) {
  const { t } = useI18n();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    mapRef.current?.remove();
    mapRef.current = null;
    host.replaceChildren();

    const mapNode = document.createElement("div");
    mapNode.className = "h-full w-full";
    host.appendChild(mapNode);

    const map = L.map(mapNode, {
      center: mapData.center,
      zoom: DEFAULT_MAP_ZOOM,
      zoomControl: true,
      attributionControl: true,
    });
    mapRef.current = map;

    L.tileLayer(DARK_TILES_URL, {
      attribution: DARK_TILES_ATTRIBUTION,
    }).addTo(map);

    L.circleMarker(mapData.center, {
      radius: 10,
      color: "#bed269",
      weight: 3,
      fillColor: "#bed269",
      fillOpacity: 0.65,
    })
      .bindPopup(
        "<strong>" +
          escapeHtml(t("map.targetSite")) +
          "</strong><br />" +
          escapeHtml(mapData.siteLabel ?? t("map.currentLocationLabel")),
      )
      .addTo(map);

    if (mapData.status === "available") {
      mapData.competitors.forEach((competitor) => {
        L.circleMarker([competitor.lat, competitor.lng], {
          radius: 6,
          color: "#ffffff",
          weight: 2,
          fillColor: markerColor(competitor.proximityLevel),
          fillOpacity: 1,
        })
          .bindPopup(
            '<span class="font-mono text-xs"><strong>' +
              escapeHtml(competitor.name) +
              "</strong><br />" +
              escapeHtml(competitor.type) +
              " / " +
              competitor.distanceMeters +
              " M<br />" +
              escapeHtml(t("map.proximity")) +
              ": " +
              competitor.proximityLevel +
              "</span>",
          )
          .addTo(map);
      });
    }

    window.setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      if (mapRef.current === map) {
        mapRef.current = null;
      }
      mapNode.remove();
      if (host.contains(mapNode)) {
        host.removeChild(mapNode);
      }
    };
  }, [mapData, t]);

  return (
    <div className="relative h-full w-full">
      <div className="absolute left-4 top-4 z-[500] space-y-1 bg-black/90 px-3 py-2 font-mono">
        <p className="text-[10px] tracking-[0.2em] text-lime-300">{t("map.liveMarket")}</p>
        <p className="text-[10px] text-zinc-400">
          {mapData.locationMode === "current" ? t("map.currentLocation") : t("map.selectedAddress")} / {mapData.searchRadiusMeters} M
        </p>
      </div>
      <div ref={hostRef} className="h-full w-full" />
      <div className="absolute bottom-6 left-4 right-4 z-[500] border border-zinc-700 bg-black/90 p-3 font-mono text-[10px]">
        {mapData.status === "unavailable" ? (
          <span className="text-amber-300">{mapData.message ?? t("map.unavailable")}</span>
        ) : (
          <span className="text-zinc-300">
            {t("map.verifiedNearby", { count: mapData.competitors.length })}
          </span>
        )}
      </div>
    </div>
  );
}
