'use client';

import { BackButton } from '@ai-explore/ui';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link, useRouter } from '@/i18n/navigation';
import { accountBackButtonStyles as styles } from './AccountBackButton.styles';

export type AccountBackButtonProps = {
  label: string;
  href?: string | undefined;
};

export function AccountBackButton({ label, href }: AccountBackButtonProps) {
  const router = useRouter();
  if (href)
    return (
      <BackButton
        asChild
        size="md"
        label={label}
        className={styles.root}
        data-testid={TEST_IDS.account.backButton}
      >
        <Link href={href} />
      </BackButton>
    );
  const goBack = () => {
    if (window.history.length > 1) router.back();
    else router.push(routes.library);
  };
  return (
    <BackButton
      size="md"
      label={label}
      className={styles.root}
      onClick={goBack}
      data-testid={TEST_IDS.account.backButton}
    />
  );
}
