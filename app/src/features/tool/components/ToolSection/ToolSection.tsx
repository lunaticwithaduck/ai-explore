import { Card, Heading, Text } from '@ai-explore/ui';
import type { HTMLAttributes, ReactNode } from 'react';

export type ToolSectionProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title: string;
  description?: string | undefined;
  aside?: ReactNode;
  children: ReactNode;
};

export function ToolSection({ title, description, aside, children, ...props }: ToolSectionProps) {
  return (
    <Card asChild padding="lg">
      <section {...props}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Heading level={2}>{title}</Heading>
            {description && (
              <Text size="sm" tone="muted" className="mt-1">
                {description}
              </Text>
            )}
          </div>
          {aside}
        </div>
        {children}
      </section>
    </Card>
  );
}
