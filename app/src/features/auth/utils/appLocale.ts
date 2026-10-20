import { hasLocale } from 'next-intl';
import { type Locale, routing } from '@/i18n/routing';

export const toAppLocale = (value: string): Locale =>
  hasLocale(routing.locales, value) ? value : routing.defaultLocale;
