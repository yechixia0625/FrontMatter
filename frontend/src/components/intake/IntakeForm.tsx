"use client";

import { cn } from "@/lib/utils";

interface IntakeFormProps {
  businessType: string;
  expectedRent: string;
  squareMeters: string;
  onBusinessTypeChange: (value: string) => void;
  onExpectedRentChange: (value: string) => void;
  onSquareMetersChange: (value: string) => void;
}

export function IntakeForm({
  businessType,
  expectedRent,
  squareMeters,
  onBusinessTypeChange,
  onExpectedRentChange,
  onSquareMetersChange,
}: IntakeFormProps) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          Target Business
        </label>
        <input
          type="text"
          placeholder="e.g. Cafe, Boutique"
          value={businessType}
          onChange={(e) => onBusinessTypeChange(e.target.value)}
          className={cn(
            "w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm",
            "placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600",
            "font-mono"
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          Expected Rent
        </label>
        <input
          type="number"
          placeholder="5000"
          value={expectedRent}
          onChange={(e) => onExpectedRentChange(e.target.value)}
          className={cn(
            "w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm",
            "placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600",
            "font-mono"
          )}
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
          Square Meters
        </label>
        <input
          type="number"
          placeholder="80"
          value={squareMeters}
          onChange={(e) => onSquareMetersChange(e.target.value)}
          className={cn(
            "w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm",
            "placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600",
            "font-mono"
          )}
        />
      </div>
    </div>
  );
}
