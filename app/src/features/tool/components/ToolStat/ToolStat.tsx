import { Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';

export type ToolStatProps = {
  label: string;
  children: ReactNode;
};

export function ToolStat({ label, children }: ToolStatProps) {
  return (
    <div className="flex flex-col gap-1">
      <dt>
        <Text as="span" size="sm" tone="muted">
          {label}
        </Text>
      </dt>
      <dd>{children}</dd>
    </div>
  );
}
