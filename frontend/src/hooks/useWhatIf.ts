"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  calculateProfit,
  calculatePaybackMonths,
  calculateRentPressure,
} from "@/math";
import type { ProfitInput, ProfitResult } from "@/math/profit";

interface WhatIfState {
  expectedTraffic: number;
  averageSpend: number;
  baseRent: number;
}

interface UseWhatIfReturn {
  sliders: WhatIfState;
  setSlider: <K extends keyof WhatIfState>(
    key: K,
    value: WhatIfState[K]
  ) => void;
  result: ProfitResult;
  paybackMonths: number;
  rentPressure: number;
}

export function useWhatIf(
  baseInput: ProfitInput & { initialDecorationCost?: number },
  initialOverrides?: Partial<WhatIfState>
): UseWhatIfReturn {
  const [sliders, setSliders] = useState<WhatIfState>({
    expectedTraffic:
      initialOverrides?.expectedTraffic ?? baseInput.expectedTraffic,
    averageSpend: initialOverrides?.averageSpend ?? baseInput.averageSpend,
    baseRent: initialOverrides?.baseRent ?? baseInput.baseRent,
  });

  useEffect(() => {
    setSliders({
      expectedTraffic:
        initialOverrides?.expectedTraffic ?? baseInput.expectedTraffic,
      averageSpend: initialOverrides?.averageSpend ?? baseInput.averageSpend,
      baseRent: initialOverrides?.baseRent ?? baseInput.baseRent,
    });
  }, [
    baseInput.averageSpend,
    baseInput.baseRent,
    baseInput.expectedTraffic,
    initialOverrides?.averageSpend,
    initialOverrides?.baseRent,
    initialOverrides?.expectedTraffic,
  ]);

  const setSlider = useCallback(
    <K extends keyof WhatIfState>(key: K, value: WhatIfState[K]) => {
      setSliders((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const profitInput: ProfitInput = useMemo(
    () => ({
      ...baseInput,
      ...sliders,
    }),
    [baseInput, sliders]
  );

  const result = useMemo(() => calculateProfit(profitInput), [profitInput]);

  const paybackMonths = useMemo(
    () =>
      calculatePaybackMonths(
        baseInput.initialDecorationCost ?? 45000,
        result.netProfit
      ),
    [result.netProfit, baseInput.initialDecorationCost]
  );

  const rentPressure = useMemo(
    () => calculateRentPressure(profitInput.baseRent, result.netRevenue),
    [profitInput.baseRent, result.netRevenue]
  );

  return { sliders, setSlider, result, paybackMonths, rentPressure };
}
