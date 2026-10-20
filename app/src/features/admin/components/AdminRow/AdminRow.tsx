import { Card } from '@ai-explore/ui';
import type { ReactNode } from 'react';
import { adminRowStyles } from './AdminRow.styles';

export type AdminRowProps = {
  id: string;
  testId?: string | undefined;
  children: ReactNode;
};

export function AdminRow({ id, testId, children }: AdminRowProps) {
  return (
    <Card padding="sm" className={adminRowStyles.root} data-testid={testId} data-id={id}>
      {children}
    </Card>
  );
}
