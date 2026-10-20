import { Card, cn, Heading, Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';

export type DemoSectionProps = {
  id: string;
  title: string;
  description: string;
  wide?: boolean;
  children: ReactNode;
};

export function DemoSection({ id, title, description, wide = false, children }: DemoSectionProps) {
  return (
    <Card asChild variant="raised" padding="lg" className={cn(wide && 'lg:col-span-2')}>
      <section
        id={id}
        aria-labelledby={`${id}-title`}
        className="flex min-w-0 scroll-mt-6 flex-col gap-6"
      >
        <div className="flex flex-col gap-1">
          <Heading level={2} size="lg" id={`${id}-title`}>
            {title}
          </Heading>
          <Text tone="muted" size="sm">
            {description}
          </Text>
        </div>
        {children}
      </section>
    </Card>
  );
}
