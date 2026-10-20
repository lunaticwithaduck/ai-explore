'use client';

import { Button, Heading, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';

export type LibraryEmptyProps = {
  onReset: () => void;
};

export function LibraryEmpty({ onReset }: LibraryEmptyProps) {
  const t = useTranslations('library');
  return (
    <div
      data-testid={TEST_IDS.library.empty}
      className="flex flex-col items-center gap-3 rounded-card border border-border px-4 py-12 text-center"
    >
      <Heading level={2} size="md">
        {t('emptyTitle')}
      </Heading>
      <Text tone="muted">{t('emptyBody')}</Text>
      <Button variant="secondary" onClick={onReset}>
        {t('reset')}
      </Button>
    </div>
  );
}
