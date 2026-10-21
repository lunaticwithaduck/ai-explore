'use client';

import { cn, Text } from '@ai-explore/ui';
import { Circle, CircleCheck, LoaderCircle, type LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DELETE_STEPS, type DeleteStep } from '../../config/constants';
import { deleteProgressStyles as styles } from './DeleteProgress.styles';

export type DeleteProgressProps = {
  step: DeleteStep | null;
};

type StepStatus = 'done' | 'active' | 'pending';

const STATUS_ICONS: Record<StepStatus, LucideIcon> = {
  done: CircleCheck,
  active: LoaderCircle,
  pending: Circle,
};

const statusOf = (index: number, current: number): StepStatus =>
  index < current ? 'done' : index === current ? 'active' : 'pending';

export function DeleteProgress({ step }: DeleteProgressProps) {
  const t = useTranslations('account');
  const current = step === null ? -1 : DELETE_STEPS.indexOf(step);
  return (
    <div role="status" aria-live="polite" className={styles.root}>
      <Text size="sm" tone="muted">
        {t('delete.progress')}
      </Text>
      <ol className={styles.list}>
        {DELETE_STEPS.map((item, index) => {
          const status = statusOf(index, current);
          const Icon = STATUS_ICONS[status];
          return (
            <li
              key={item}
              data-id={item}
              data-status={status}
              aria-current={status === 'active' ? 'step' : undefined}
              className={styles.item}
            >
              <Icon aria-hidden className={cn(styles.icon, styles[status])} />
              <Text size="sm" tone={status === 'pending' ? 'muted' : 'default'}>
                {t(`delete.steps.${item}`)}
              </Text>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
