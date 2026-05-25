export interface ProfitInput {
  expectedTraffic: number;
  averageSpend: number;
  conversionRate: number;
  grossMargin: number;
  baseRent: number;
  fixedCostNonRent: number;
}

export interface ProfitResult {
  grossRevenue: number;
  netRevenue: number;
  netProfit: number;
  profitMargin: number;
  isCritical: boolean;
}

/**
 * Core profit formula:
 * Net Profit = (DailyTraffic * 30 * Spend * Conversion * GrossMargin) - Rent - Fixed Costs
 */
export function calculateProfit(input: ProfitInput): ProfitResult {
  const monthlyTraffic = input.expectedTraffic * 30;
  const payingCustomers = monthlyTraffic * input.conversionRate;
  const grossRevenue = payingCustomers * input.averageSpend;
  const netRevenue = grossRevenue * input.grossMargin;
  const netProfit = netRevenue - input.baseRent - input.fixedCostNonRent;

  return {
    grossRevenue,
    netRevenue,
    netProfit,
    profitMargin: grossRevenue > 0 ? netProfit / grossRevenue : 0,
    isCritical: netProfit < 0,
  };
}
