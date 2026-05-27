"use client";

import { ExternalLink, MapPin } from "lucide-react";
import type { CandidateLocation } from "@/types/report";

interface LocationRecommendationsProps {
  locations: CandidateLocation[];
}

export function LocationRecommendations({ locations }: LocationRecommendationsProps) {
  if (locations.length === 0) return null;

  return (
    <section className="border-t border-zinc-800 p-4">
      <div className="mb-3 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-500">
        <MapPin size={13} />
        3 Singapore alternatives
      </div>
      <div className="space-y-3">
        {locations.map((location, index) => (
          <article
            key={`${location.name}-${location.lat}-${location.lng}`}
            className="rounded border border-zinc-800 bg-zinc-950 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="font-mono text-[10px] text-lime-300">
                  OPTION {index + 1} / SCORE {location.score}
                </div>
                <h3 className="mt-1 break-words text-sm font-semibold text-zinc-100">
                  {location.name}
                </h3>
                <p className="mt-1 break-words font-mono text-[10px] leading-4 text-zinc-500">
                  {location.address}
                </p>
              </div>
              <span className="shrink-0 rounded border border-zinc-700 px-2 py-1 font-mono text-[10px] text-zinc-400">
                {location.area}
              </span>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-[10px] text-zinc-500">
              <span>{location.rentBenchmark}</span>
              <span className="text-right text-zinc-300">
                S${location.estimatedMonthlyRent.toLocaleString()}/mo
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {location.nearbySignals.map((signal) => (
                <span
                  key={signal}
                  className="rounded border border-zinc-800 px-2 py-1 font-mono text-[10px] text-zinc-400"
                >
                  {signal}
                </span>
              ))}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3 text-[11px] leading-4">
              <div className="space-y-1 text-zinc-400">
                {location.pros.slice(0, 2).map((item) => (
                  <p key={item}>+ {item}</p>
                ))}
              </div>
              <div className="space-y-1 text-zinc-500">
                {location.cons.slice(0, 2).map((item) => (
                  <p key={item}>- {item}</p>
                ))}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {location.sourceLinks.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-1 font-mono text-[10px] text-zinc-300 hover:border-zinc-500"
                >
                  <ExternalLink size={11} />
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
