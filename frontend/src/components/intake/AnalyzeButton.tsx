"use client";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnalyzeButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export function AnalyzeButton({ disabled, onClick }: AnalyzeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full flex items-center justify-center gap-2 py-3 rounded font-mono text-sm uppercase tracking-wider transition-all",
        disabled
          ? "bg-zinc-900 text-zinc-600 cursor-not-allowed"
          : "bg-white text-black hover:bg-zinc-200 active:scale-[0.98]"
      )}
    >
      <span>Analyze Space</span>
      <ArrowRight className="w-4 h-4" />
    </button>
  );
}
