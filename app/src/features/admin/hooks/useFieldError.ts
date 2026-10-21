'use client';

import { useTranslations } from 'next-intl';
import { get, useFormContext } from 'react-hook-form';
import { fieldErrorKey, isEmptyValue } from '../utils/fieldErrors';

export type UseFieldErrorOptions = {
  numeric?: boolean;
  money?: boolean;
};

export function useFieldError(name: string, options: UseFieldErrorOptions = {}) {
  const t = useTranslations('admin');
  const { formState, getValues } = useFormContext();
  const error = get(formState.errors, name) as { type?: string } | undefined;
  if (!error) return { failed: false, message: undefined };
  const key = fieldErrorKey({
    name,
    type: error.type,
    empty: isEmptyValue(getValues(name)),
    ...options,
  });
  return { failed: true, message: t(`fieldErrors.${key}`) };
}
