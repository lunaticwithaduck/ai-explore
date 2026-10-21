'use client';

import { Input, Textarea } from '@ai-explore/ui';
import { useFormContext } from 'react-hook-form';
import { useFieldError } from '../../hooks/useFieldError';
import { AdminField, fieldMessageId } from '../AdminField/AdminField';

export type AdminTextFieldProps = {
  name: string;
  label: string;
  testId?: string | undefined;
  multiline?: boolean;
  numeric?: boolean;
  placeholder?: string | undefined;
  hint?: string | undefined;
  wide?: boolean;
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
  hint,
  wide = false,
  inputType = 'text',
}: AdminTextFieldProps) {
  const { register } = useFormContext();
  const id = `field-${name}`;
  const { failed, message } = useFieldError(name, { numeric });
  const registered = register(name, numeric ? { setValueAs: toNumber } : undefined);
  const describedBy = message || hint ? fieldMessageId(id) : undefined;
  return (
    <AdminField id={id} label={label} error={message} hint={hint} wide={wide}>
      {multiline ? (
        <Textarea
          id={id}
          invalid={failed}
          placeholder={placeholder}
          aria-describedby={describedBy}
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
          aria-describedby={describedBy}
          data-testid={testId}
          {...registered}
        />
      )}
    </AdminField>
  );
}
