import type { Locale } from '@ai-explore/schemas';

const INTL_LOCALE: Record<Locale, string> = { en: 'en-US', bg: 'bg-BG' };

export function formatCents(cents: number, locale: Locale): string {
  const whole = cents % 100 === 0;
  return new Intl.NumberFormat(INTL_LOCALE[locale], {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
