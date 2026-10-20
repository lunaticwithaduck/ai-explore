import { z } from 'zod';
import type { Locale } from './common';

export const localizedSchema = z.object({
  en: z.string().min(1),
  bg: z.string().min(1).optional(),
});

export type Localized = z.infer<typeof localizedSchema>;

export function pickLocalized(value: Localized, locale: Locale): string {
  return locale === 'bg' && value.bg ? value.bg : value.en;
}
