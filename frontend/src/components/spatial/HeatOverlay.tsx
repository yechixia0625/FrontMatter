"use client";

import type { HeatZone } from "@/types/spatial";

interface HeatOverlayProps {
  heatZones: HeatZone[];
}

export function HeatOverlay({ heatZones }: HeatOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {heatZones.map((zone, i) => {
        const isHighProfit = zone.type === "high_profit";
        const color = isHighProfit
          ? "rgba(34, 197, 94, VAR_OPACITY)"
          : "rgba(239, 68, 68, VAR_OPACITY)";
        const colorWithOpacity = color.replace(
          "VAR_OPACITY",
          String(zone.intensity * 0.4)
        );

        return (
          <div
            key={i}
            className="absolute rounded-full heat-zone"
            style={{
              left: `${zone.x}%`,
              top: `${zone.y}%`,
              width: `${zone.radius * 2}%`,
              height: `${zone.radius * 2}%`,
              transform: "translate(-50%, -50%)",
              background: `radial-gradient(circle, ${colorWithOpacity} 0%, transparent 70%)`,
            }}
          />
        );
      })}
    </div>
  );
}
