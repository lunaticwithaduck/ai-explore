'use client';

import { Switch } from '@ai-explore/ui';
import { Controller, useFormContext } from 'react-hook-form';
import { AdminField } from '../AdminField/AdminField';

export type AdminSwitchFieldProps = {
  name: string;
  label: string;
  testId?: string | undefined;
};

export function AdminSwitchField({ name, label, testId }: AdminSwitchFieldProps) {
  const { control } = useFormContext();
  const id = `field-${name}`;
  return (
    <AdminField id={id} label={label} inline>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Switch
            id={id}
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
            data-testid={testId}
          />
        )}
      />
    </AdminField>
  );
}
