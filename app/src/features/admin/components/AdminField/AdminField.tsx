import { cn, Label, Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';
import { adminFieldStyles } from './AdminField.styles';

export type AdminFieldProps = {
  id: string;
  label: string;
  error?: string | undefined;
  hint?: string | undefined;
  inline?: boolean;
  wide?: boolean;
  children: ReactNode;
};

export const fieldMessageId = (id: string) => `${id}-message`;

export function AdminField({
  id,
  label,
  error,
  hint,
  inline = false,
  wide = false,
  children,
}: AdminFieldProps) {
  const message = error ?? hint;
  return (
    <div
      className={cn(
        inline ? adminFieldStyles.inline : adminFieldStyles.root,
        wide && adminFieldStyles.wide,
      )}
    >
      <Label htmlFor={id}>{label}</Label>
      {children}
      {message && (
        <Text id={fieldMessageId(id)} size="xs" tone={error ? 'danger' : 'muted'}>
          {message}
        </Text>
      )}
    </div>
  );
}
