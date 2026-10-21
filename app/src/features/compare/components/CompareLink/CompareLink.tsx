'use client';

import { Button } from '@ai-explore/ui';
import { GitCompareArrows } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link } from '@/i18n/navigation';

export type CompareLinkProps = {
  toolId: string;
  otherToolId: string | undefined;
  className?: string | undefined;
};

export function CompareLink({ toolId, otherToolId, className }: CompareLinkProps) {
  const t = useTranslations('compare');
  return (
    <Button asChild variant="secondary" iconLeft={GitCompareArrows} className={className}>
      <Link href={routes.compare(toolId, otherToolId)} data-testid={TEST_IDS.compare.link}>
        {t('link')}
      </Link>
    </Button>
  );
}
