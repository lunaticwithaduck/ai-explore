'use client';

import { Button, cn, Text } from '@ai-explore/ui';
import { Heart } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { signInHref } from '@/features/auth/utils/nextParam';
import { Link, usePathname } from '@/i18n/navigation';
import { useSaveToggle } from '../../hooks/useSaveToggle';
import { toolSaveButtonStyles as styles } from './ToolSaveButton.styles';

export type ToolSaveButtonProps = {
  toolId: string;
  className?: string | undefined;
};

export function ToolSaveButton({ toolId, className }: ToolSaveButtonProps) {
  const t = useTranslations('tool.header');
  const te = useTranslations('errors');
  const pathname = usePathname();
  const { signedOut, ready, saved, errorCode, toggle } = useSaveToggle(toolId);

  if (signedOut)
    return (
      <Button asChild variant="secondary" iconLeft={Heart} className={className}>
        <Link href={signInHref(pathname)} data-testid={TEST_IDS.myLibrary.saveButton}>
          {t('save')}
        </Link>
      </Button>
    );

  return (
    <>
      <Button
        variant="secondary"
        iconLeft={Heart}
        aria-pressed={saved}
        disabled={!ready}
        onClick={toggle}
        data-testid={TEST_IDS.myLibrary.saveButton}
        className={cn(className, saved && styles.saved)}
      >
        {saved ? t('saved') : t('save')}
      </Button>
      {errorCode && (
        <Text role="alert" className="sr-only">
          {te(errorCode)}
        </Text>
      )}
    </>
  );
}
