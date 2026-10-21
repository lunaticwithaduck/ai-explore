'use client';

import { Select, type SelectOption } from '@ai-explore/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { useFieldError } from '../../hooks/useFieldError';
import { AdminField } from '../AdminField/AdminField';

export type AdminSelectFieldProps = {
  name: string;
  label: string;
  options: readonly SelectOption[];
  placeholder?: string | undefined;
  hint?: string | undefined;
  testId?: string | undefined;
};

export function AdminSelectField({
  name,
  label,
  options,
  placeholder,
  hint,
  testId,
}: AdminSelectFieldProps) {
  const { control } = useFormContext();
  const id = `field-${name}`;
  const { failed, message } = useFieldError(name);
  return (
    <AdminField id={id} label={label} error={message} hint={hint}>
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
