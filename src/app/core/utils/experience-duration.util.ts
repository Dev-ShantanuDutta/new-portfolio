/**
 * Formats elapsed time since `startDate` as a rounded-down half-year figure
 * with a trailing "+" (e.g. 4 yrs 1 mo -> "4+", 4 yrs 6 mo -> "4.5+").
 */
export function formatYearsOfExperience(startDate: string, asOf: Date = new Date()): string {
  const start = new Date(startDate);

  let months =
    (asOf.getFullYear() - start.getFullYear()) * 12 + (asOf.getMonth() - start.getMonth());
  if (asOf.getDate() < start.getDate()) {
    months -= 1;
  }

  const halfYears = Math.max(0, Math.floor(months / 6));
  const years = halfYears / 2;

  return `${Number.isInteger(years) ? years : years.toFixed(1)}+`;
}
