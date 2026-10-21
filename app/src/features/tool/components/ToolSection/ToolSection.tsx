import { Card, cn, Heading, Text } from '@ai-explore/ui';
import type { LucideIcon } from 'lucide-react';
import { type HTMLAttributes, type ReactNode, useId } from 'react';
import { toolSectionStyles as styles } from './ToolSection.styles';

export type ToolSectionProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  title: string;
  icon?: LucideIcon | undefined;
  description?: string | undefined;
  spacing?: keyof typeof styles.spacing | undefined;
  aside?: ReactNode;
  children: ReactNode;
};

export function ToolSection({
  title,
  icon: Icon,
  description,
  spacing = 'md',
  aside,
  children,
  className,
  ...props
}: ToolSectionProps) {
  const headingId = useId();
  return (
    <Card asChild padding="none" className={cn(styles.root, className)}>
      <section aria-labelledby={headingId} {...props}>
        <div className={cn(styles.header, styles.spacing[spacing])}>
          <div className="min-w-0">
            <div className={styles.titleRow}>
              {Icon && <Icon aria-hidden className={styles.icon} />}
              <Heading level={2} id={headingId}>
                {title}
              </Heading>
            </div>
            {description && (
              <Text size="sm" tone="muted" className={styles.description}>
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
