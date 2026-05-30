"use client";

import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";
import { useI18n } from "@/i18n/I18nProvider";

interface RentGaugeProps {
  value: number; // 0-100
}

export function RentGauge({ value }: RentGaugeProps) {
  const { t } = useI18n();
  const clampedValue = Math.min(100, Math.max(0, value));

  // Color based on pressure level
  const getColor = (v: number) => {
    if (v < 30) return "#22c55e"; // green
    if (v < 60) return "#eab308"; // yellow
    return "#ef4444"; // red
  };

  const color = getColor(clampedValue);
  const data = [{ name: "Rent Pressure", value: clampedValue, fill: color }];

  return (
    <div className="flex flex-col items-center space-y-2">
      <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
        {t("whatIf.rentPressure")}
      </span>
      <div className="relative w-28 h-28">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            data={data}
            innerRadius="74%"
            outerRadius="92%"
            startAngle={90}
            endAngle={90 - (clampedValue / 100) * 360}
          >
            <RadialBar dataKey="value" background={{ fill: "#18181b" }} cornerRadius={8} />
          </RadialBarChart>
        </ResponsiveContainer>
        {/* Center value */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="text-2xl font-mono font-bold"
            style={{ color }}
          >
            {clampedValue.toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}
