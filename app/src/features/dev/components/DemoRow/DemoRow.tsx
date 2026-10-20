import { cn, Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';

export type DemoRowProps = {
  label: string;
  className?: string;
  children: ReactNode;
};

export function DemoRow({ label, className, children }: DemoRowProps) {
  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <Text as="span" size="xs" tone="subtle" weight="medium" className="uppercase tracking-wider">
        {label}
      </Text>
      <div className={cn('flex flex-wrap items-center gap-3', className)}>{children}</div>
    </div>
  );
}
