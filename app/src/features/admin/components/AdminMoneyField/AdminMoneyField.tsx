'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { MoneyInput } from '../MoneyInput/MoneyInput';

export type AdminMoneyFieldProps = {
  name: string;
  label: string;
  nullable?: boolean;
  placeholder?: string | undefined;
  hint?: string | undefined;
  testId?: string | undefined;
};

export function AdminMoneyField(props: AdminMoneyFieldProps) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field }) => (
        <MoneyInput
          {...props}
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
        />
      )}
    />
  );
}
