import { Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';

export type SidebarSectionProps = {
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SidebarSection({ title, action, children }: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="mb-2 flex min-h-6 items-center justify-between">
        <Text as="div" size="xs" tone="muted" weight="medium" className="uppercase tracking-wide">
          {title}
        </Text>
        {action}
      </div>
      {children}
    </div>
  );
}
