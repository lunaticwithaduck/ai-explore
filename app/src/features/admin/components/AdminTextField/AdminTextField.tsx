'use client';

import { Input, Textarea } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { get, useFormContext } from 'react-hook-form';
import { AdminField } from '../AdminField/AdminField';

export type AdminTextFieldProps = {
  name: string;
  label: string;
  testId?: string | undefined;
  multiline?: boolean;
  numeric?: boolean;
  placeholder?: string | undefined;
  inputType?: 'text' | 'url';
};

const toNumber = (value: unknown) => {
  if (value === '' || value === null || value === undefined) return undefined;
  return Number(value);
};

export function AdminTextField({
  name,
  label,
  testId,
  multiline = false,
  numeric = false,
  placeholder,
  inputType = 'text',
}: AdminTextFieldProps) {
  const t = useTranslations('admin');
  const { register, formState } = useFormContext();
  const id = `field-${name}`;
  const failed = Boolean(get(formState.errors, name));
  const registered = register(name, numeric ? { setValueAs: toNumber } : undefined);
  return (
    <AdminField id={id} label={label} error={failed ? t('form.invalid') : undefined}>
      {multiline ? (
        <Textarea
          id={id}
          invalid={failed}
          placeholder={placeholder}
          data-testid={testId}
          {...registered}
        />
      ) : (
        <Input
          id={id}
          invalid={failed}
          type={numeric ? 'number' : inputType}
          inputMode={numeric ? 'numeric' : undefined}
          placeholder={placeholder}
          data-testid={testId}
          {...registered}
        />
      )}
    </AdminField>
  );
}
