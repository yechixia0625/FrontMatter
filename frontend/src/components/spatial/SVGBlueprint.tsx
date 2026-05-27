"use client";

import type { SpatialBlueprint, BlueprintElement } from "@/types/spatial";

interface SVGBlueprintProps {
  blueprint: SpatialBlueprint;
}

function renderElement(element: BlueprintElement, index: number) {
  if (element.type === "door") {
    const hingeY = element.y + element.h;
    return (
      <g key={index}>
        <path
          d={`M ${element.x} ${hingeY} L ${element.x + element.w} ${hingeY} A ${element.h} ${element.h} 0 0 0 ${element.x} ${element.y}`}
          className="stroke-zinc-100 fill-none"
          strokeWidth={0.8}
        />
        <text x={element.x + 1} y={hingeY + 4} className="fill-zinc-500 text-[2.5px] font-mono">
          {element.label || "ENTRY"}
        </text>
      </g>
    );
  }
  const classes = {
    wall: "stroke-zinc-300 fill-zinc-900",
    fixture: "stroke-zinc-500 fill-zinc-900",
    window: "stroke-zinc-400 fill-zinc-800/30",
  };
  return (
    <g key={index}>
      <rect
        x={element.x}
        y={element.y}
        width={element.w}
        height={element.h}
        className={classes[element.type as keyof typeof classes] ?? classes.wall}
        strokeWidth={element.type === "wall" ? 1.2 : 0.6}
      />
      {element.label && (
        <text
          x={element.x + element.w / 2}
          y={element.y + element.h / 2}
          textAnchor="middle"
          className="fill-zinc-500 text-[2.5px] font-mono"
        >
          {element.label.toUpperCase()}
        </text>
      )}
    </g>
  );
}

export function SVGBlueprint({ blueprint }: SVGBlueprintProps) {
  const height = 100 / blueprint.aspectRatio;
  const path = blueprint.flowPath.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="relative h-full w-full p-5">
      <div className="absolute left-5 top-4 z-10">
        <p className="font-mono text-[10px] tracking-[0.22em] text-lime-300">
          AI PROPOSED OPERATING PLAN
        </p>
        <p className="mt-1 font-mono text-[10px] text-zinc-500">
          DECISION OVERLAY / NOT A SURVEY DRAWING
        </p>
      </div>
      <svg
        viewBox={`0 0 100 ${height}`}
        className="h-full w-full pt-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="decision-grid" width="4" height="4" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="0.13" fill="rgba(255,255,255,0.18)" />
          </pattern>
          <radialGradient id="visibility-zone">
            <stop stopColor="#bed269" stopOpacity="0.33" />
            <stop offset="1" stopColor="#bed269" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="friction-zone">
            <stop stopColor="#e16855" stopOpacity="0.28" />
            <stop offset="1" stopColor="#e16855" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height={height} fill="url(#decision-grid)" />
        {blueprint.heatZones.map((zone, index) => (
          <circle
            key={`heat-${index}`}
            cx={zone.x}
            cy={zone.y}
            r={zone.radius}
            fill={zone.type === "high_visibility" ? "url(#visibility-zone)" : "url(#friction-zone)"}
          />
        ))}
        {blueprint.elements.map(renderElement)}
        {path && (
          <>
            <polyline
              points={path}
              fill="none"
              stroke="#bed269"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
            {blueprint.flowPath.map((point, index) => (
              <circle key={`flow-${index}`} cx={point.x} cy={point.y} r="1.1" fill="#bed269" />
            ))}
          </>
        )}
      </svg>
      <div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2">
        {blueprint.zoneInsights.map((insight) => (
          <div
            key={`${insight.title}-${insight.x}`}
            className={`max-w-[48%] border bg-black/90 px-3 py-2 font-mono ${
              insight.type === "opportunity" ? "border-lime-300/40" : "border-red-400/40"
            }`}
          >
            <p className={`text-[10px] ${insight.type === "opportunity" ? "text-lime-300" : "text-red-400"}`}>
              {insight.title}
            </p>
            <p className="mt-1 text-[10px] leading-4 text-zinc-400">{insight.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
