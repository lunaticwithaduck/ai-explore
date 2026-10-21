'use client';

import { Input } from '@ai-explore/ui';
import { useState } from 'react';
import { useFieldError } from '../../hooks/useFieldError';
import { centsToDollars, dollarsToCents } from '../../utils/money';
import { AdminField, fieldMessageId } from '../AdminField/AdminField';
import type { AdminMoneyFieldProps } from '../AdminMoneyField/AdminMoneyField';

export type MoneyInputProps = AdminMoneyFieldProps & {
  value: number | null | undefined;
  onChange: (value: number | null | undefined) => void;
  onBlur: () => void;
};

export function MoneyInput({
  name,
  label,
  nullable = false,
  placeholder,
  hint,
  testId,
  value,
  onChange,
  onBlur,
}: MoneyInputProps) {
  const id = `field-${name}`;
  const { failed, message } = useFieldError(name, { money: true });
  const [text, setText] = useState(() => centsToDollars(value));
  const describedBy = message || hint ? fieldMessageId(id) : undefined;
  return (
    <AdminField id={id} label={label} error={message} hint={hint}>
      <Input
        id={id}
        type="text"
        inputMode="decimal"
        invalid={failed}
        value={text}
        placeholder={placeholder}
        aria-describedby={describedBy}
        data-testid={testId}
        onBlur={onBlur}
        onChange={(event) => {
          const next = event.target.value;
          setText(next);
          if (next.trim() === '') onChange(nullable ? null : undefined);
          else onChange(dollarsToCents(next));
        }}
      />
    </AdminField>
  );
}
