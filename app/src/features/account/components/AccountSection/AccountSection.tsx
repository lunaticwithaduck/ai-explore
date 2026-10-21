import { Card, cn, Heading } from '@ai-explore/ui';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { accountSectionStyles as styles } from './AccountSection.styles';

export type AccountSectionProps = {
  title: string;
  icon?: LucideIcon | undefined;
  tone?: 'default' | 'danger';
  headingId: string;
  action?: ReactNode;
  children: ReactNode;
};

export function AccountSection({
  title,
  icon: Icon,
  tone = 'default',
  headingId,
  action,
  children,
}: AccountSectionProps) {
  return (
    <Card asChild padding="none" className={cn(styles.root, styles.border[tone])}>
      <section aria-labelledby={headingId}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            {Icon && <Icon aria-hidden className={styles.icon} />}
            <Heading level={2} size="lg" id={headingId} className={styles.heading[tone]}>
              {title}
            </Heading>
          </div>
          {action}
        </div>
        {children}
      </section>
    </Card>
  );
}
