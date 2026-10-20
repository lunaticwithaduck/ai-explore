'use client';

import { Select, type SelectOption } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { Controller, get, useFormContext } from 'react-hook-form';
import { AdminField } from '../AdminField/AdminField';

export type AdminSelectFieldProps = {
  name: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string | undefined;
  testId?: string | undefined;
};

export function AdminSelectField({
  name,
  label,
  options,
  placeholder,
  testId,
}: AdminSelectFieldProps) {
  const t = useTranslations('admin');
  const { control, formState } = useFormContext();
  const id = `field-${name}`;
  const failed = Boolean(get(formState.errors, name));
  return (
    <AdminField id={id} label={label} error={failed ? t('form.invalid') : undefined}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            id={id}
            options={options}
            value={field.value ? String(field.value) : undefined}
            onValueChange={field.onChange}
            placeholder={placeholder}
            invalid={failed}
            data-testid={testId}
          />
        )}
      />
    </AdminField>
  );
}
