const DOLLARS = /^\d{1,7}(?:\.\d{1,2})?$/;

export function dollarsToCents(text: string): number {
  const normalized = text.trim().replace(',', '.');
  if (!DOLLARS.test(normalized)) return Number.NaN;
  return Math.round(Number(normalized) * 100);
}

export function centsToDollars(cents: number | null | undefined): string {
  if (cents === null || cents === undefined || !Number.isFinite(cents)) return '';
  return cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2);
}
