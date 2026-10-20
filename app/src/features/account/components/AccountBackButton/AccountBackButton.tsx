'use client';

import { BackButton } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { useRouter } from '@/i18n/navigation';

export function AccountBackButton() {
  const t = useTranslations('account');
  const router = useRouter();
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(routes.library);
  };
  return (
    <BackButton
      label={t('backButton')}
      className="self-start"
      onClick={goBack}
      data-testid={TEST_IDS.account.backButton}
    />
  );
}
