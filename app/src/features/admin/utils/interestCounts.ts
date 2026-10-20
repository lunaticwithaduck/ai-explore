import { BUNDLE_PERIODS, type BundlePeriod } from '@ai-explore/schemas';

export type InterestEntry = {
  bundleId: string;
  period: BundlePeriod;
};

export type InterestRow = {
  bundleId: string;
  total: number;
  periods: Record<BundlePeriod, number>;
};

const emptyPeriods = (): Record<BundlePeriod, number> =>
  Object.fromEntries(BUNDLE_PERIODS.map((period) => [period, 0])) as Record<BundlePeriod, number>;

export function countInterest(
  entries: readonly InterestEntry[],
  bundleIds: readonly string[] = [],
): InterestRow[] {
  const rows = new Map<string, InterestRow>();
  const rowFor = (bundleId: string) => {
    const existing = rows.get(bundleId);
    if (existing) return existing;
    const created: InterestRow = { bundleId, total: 0, periods: emptyPeriods() };
    rows.set(bundleId, created);
    return created;
  };
  for (const bundleId of bundleIds) rowFor(bundleId);
  for (const { bundleId, period } of entries) {
    const row = rowFor(bundleId);
    row.total += 1;
    row.periods[period] += 1;
  }
  return [...rows.values()].sort(
    (a, b) => b.total - a.total || a.bundleId.localeCompare(b.bundleId),
  );
}
