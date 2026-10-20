import { Card, cn, Heading, Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';
import { accountSectionStyles } from './AccountSection.styles';

export type AccountSectionProps = {
  title: string;
  description?: string | undefined;
  tone?: 'default' | 'danger';
  headingId: string;
  action?: ReactNode;
  children: ReactNode;
};

export function AccountSection({
  title,
  description,
  tone = 'default',
  headingId,
  action,
  children,
}: AccountSectionProps) {
  return (
    <Card
      asChild
      padding="lg"
      className={cn(accountSectionStyles.base, accountSectionStyles[tone])}
    >
      <section aria-labelledby={headingId}>
        <div className={accountSectionStyles.header}>
          <div className={accountSectionStyles.titles}>
            <Heading level={2} size="md" id={headingId}>
              {title}
            </Heading>
            {description && (
              <Text size="sm" tone="muted">
                {description}
              </Text>
            )}
          </div>
          {action}
        </div>
        {children}
      </section>
    </Card>
  );
}
