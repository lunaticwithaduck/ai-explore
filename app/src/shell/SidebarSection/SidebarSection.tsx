import { Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';

export type SidebarSectionProps = {
  title: string;
  children: ReactNode;
};

export function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <Text
        as="div"
        size="xs"
        tone="subtle"
        weight="semibold"
        className="mb-1.5 px-3 uppercase tracking-wider"
      >
        {title}
      </Text>
      {children}
    </div>
  );
}
