'use client';

import { Button, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';

export type LibraryEmptyProps = {
  onReset?: (() => void) | undefined;
};

export function LibraryEmpty({ onReset }: LibraryEmptyProps) {
  const t = useTranslations('library');
  return (
    <div
      data-testid={TEST_IDS.library.empty}
      className="flex flex-col items-center gap-4 py-16 text-center"
    >
      <Text tone="muted">{t('emptyTitle')}</Text>
      {onReset && <Button onClick={onReset}>{t('reset')}</Button>}
    </div>
  );
}
