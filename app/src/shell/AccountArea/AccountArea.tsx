'use client';

import { Button, Skeleton, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useSignOutWarning } from '@/features/auth/hooks/useSignOut';
import { isAuthRoute, signInHref } from '@/features/auth/utils/nextParam';
import { Link, usePathname } from '@/i18n/navigation';
import { UserMenu } from '../UserMenu/UserMenu';

export function AccountArea() {
  const t = useTranslations('shell');
  const { status } = useCurrentUser();
  const pathname = usePathname();
  const warning = useSignOutWarning();

  if (status === 'loading') return <Skeleton shape="circle" className="size-9" />;
  if (status === 'signedIn') return <UserMenu />;
  if (isAuthRoute(pathname)) return null;
  return (
    <>
      {warning && (
        <Text as="span" role="status" size="xs" tone="danger" className="max-w-48">
          {t('account.signOutUnsaved')}
        </Text>
      )}
      <Button asChild size="sm" data-testid={TEST_IDS.shell.signIn}>
        <Link href={signInHref(pathname)}>{t('account.signIn')}</Link>
      </Button>
    </>
  );
}
