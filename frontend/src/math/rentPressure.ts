/**
 * Calculate rent pressure as a percentage (0-100).
 * Higher values indicate rent is consuming more revenue.
 */
export function calculateRentPressure(
  baseRent: number,
  netRevenue: number
): number {
  if (netRevenue <= 0) return 100;
  return Math.min(100, (baseRent / netRevenue) * 100);
}
