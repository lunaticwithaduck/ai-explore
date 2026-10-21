import { Heading, Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';

export type LibraryHeaderProps = {
  title: string;
  subtitle: string;
  actions?: ReactNode;
};

export function LibraryHeader({ title, subtitle, actions }: LibraryHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-col gap-2">
        <Heading level={1} className="break-words">
          {title}
        </Heading>
        <Text tone="muted">{subtitle}</Text>
      </div>
      {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
    </header>
  );
}
