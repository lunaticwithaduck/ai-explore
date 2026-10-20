import { Label, Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';
import { adminFieldStyles } from './AdminField.styles';

export type AdminFieldProps = {
  id: string;
  label: string;
  error?: string | undefined;
  inline?: boolean;
  children: ReactNode;
};

export function AdminField({ id, label, error, inline = false, children }: AdminFieldProps) {
  const messageId = `${id}-message`;
  return (
    <div className={inline ? adminFieldStyles.inline : adminFieldStyles.root}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && (
        <Text id={messageId} size="xs" tone="danger">
          {error}
        </Text>
      )}
    </div>
  );
}
