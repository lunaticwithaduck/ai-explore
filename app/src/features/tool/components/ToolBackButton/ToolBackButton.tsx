'use client';

import { BackButton, cn } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { useRouter } from '@/i18n/navigation';
import { toolBackButtonStyles as styles } from './ToolBackButton.styles';

export type ToolBackButtonProps = {
  className?: string | undefined;
};

export function ToolBackButton({ className }: ToolBackButtonProps) {
  const t = useTranslations('tool.header');
  const router = useRouter();
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(routes.library);
  };
  return (
    <BackButton
      label={t('back')}
      size="md"
      onClick={goBack}
      className={cn(styles.root, className)}
    />
  );
}
