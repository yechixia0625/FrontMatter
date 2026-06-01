export function isWithinSingapore(latitude: number, longitude: number): boolean {
  return latitude >= 1.15 && latitude <= 1.48 && longitude >= 103.55 && longitude <= 104.1;
}
