import { useLocale } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { toAppLocale } from '../utils/appLocale';

export function useAppLocale(): Locale {
  return toAppLocale(useLocale());
}
