import { Heading, Text } from '@ai-explore/ui';
import type { ReactNode } from 'react';
import { emptyStateStyles } from './EmptyState.styles';

export type EmptyStateProps = {
  title: string;
  body: string;
  action?: ReactNode;
  'data-testid'?: string | undefined;
};

export function EmptyState({ title, body, action, ...props }: EmptyStateProps) {
  return (
    <div className={emptyStateStyles.root} {...props}>
      <Heading level={2} size="md">
        {title}
      </Heading>
      <Text tone="muted">{body}</Text>
      {action}
    </div>
  );
}
