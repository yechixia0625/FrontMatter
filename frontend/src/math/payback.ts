/**
 * Calculate months to recoup initial investment.
 * Returns Infinity if monthly profit is zero or negative.
 */
export function calculatePaybackMonths(
  initialCost: number,
  monthlyNetProfit: number
): number {
  if (monthlyNetProfit <= 0) return Infinity;
  return initialCost / monthlyNetProfit;
}
