import { cn, Text } from '@ai-explore/ui';
import { CircleAlert, CircleCheck } from 'lucide-react';
import { authAlertStyles } from './AuthAlert.styles';

export type AuthAlertProps = {
  tone?: 'danger' | 'success';
  message: string;
  'data-testid'?: string;
};

export function AuthAlert({ tone = 'danger', message, 'data-testid': testId }: AuthAlertProps) {
  const Icon = tone === 'danger' ? CircleAlert : CircleCheck;
  return (
    <div
      role={tone === 'danger' ? 'alert' : 'status'}
      data-testid={testId}
      className={cn(authAlertStyles.base, authAlertStyles[tone])}
    >
      <Icon aria-hidden className={authAlertStyles.icon} />
      <Text size="sm" tone="inherit">
        {message}
      </Text>
    </div>
  );
}
