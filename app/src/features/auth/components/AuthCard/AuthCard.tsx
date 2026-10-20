import { Card, Heading, Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';
import { authCardStyles } from './AuthCard.styles';

export type AuthCardProps = {
  title: string;
  subtitle: string;
  footer?: ReactNode;
  children: ReactNode;
};

export function AuthCard({ title, subtitle, footer, children }: AuthCardProps) {
  return (
    <Card variant="raised" padding="lg" className={authCardStyles.card}>
      <div className={authCardStyles.header}>
        <Heading level={1} size="xl">
          {title}
        </Heading>
        <Text tone="muted" size="sm">
          {subtitle}
        </Text>
      </div>
      <div className={authCardStyles.body}>{children}</div>
      {footer && <div className={authCardStyles.footer}>{footer}</div>}
    </Card>
  );
}
