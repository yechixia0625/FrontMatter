"use client";

import { useState, useEffect } from "react";

const LOADING_LINES = [
  "[Initializing Spatial Matrix...]",
  "[Connecting to Analysis Engine...]",
  "[Loading Financial Models...]",
  "[Scanning Competitive Landscape...]",
  "[Preparing Spatial Blueprints...]",
  "[Calibrating Heat Zone Algorithms...]",
  "[Syncing Multi-Agent Pipeline...]",
  "[Ready.]",
];

export function HackerLoading() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex >= LOADING_LINES.length) return;

    const timer = setTimeout(
      () => {
        setLines((prev) => [...prev, LOADING_LINES[currentIndex]]);
        setCurrentIndex((prev) => prev + 1);
      },
      200 + Math.random() * 300
    );

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-xl font-mono text-sm space-y-1">
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              i === LOADING_LINES.length - 1
                ? "text-white font-bold"
                : "text-zinc-500"
            }
          >
            {line}
          </div>
        ))}
        {currentIndex < LOADING_LINES.length && (
          <span className="inline-block w-2 h-4 bg-white terminal-cursor" />
        )}
      </div>
    </div>
  );
}
