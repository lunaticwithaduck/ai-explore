'use client';

import { Button, Skeleton } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { isAuthRoute, signInHref } from '@/features/auth/utils/nextParam';
import { Link, usePathname } from '@/i18n/navigation';
import { UserMenu } from '../UserMenu/UserMenu';

export function AccountArea() {
  const t = useTranslations('shell');
  const { status } = useCurrentUser();
  const pathname = usePathname();

  if (status === 'loading') return <Skeleton shape="circle" className="size-9" />;
  if (status === 'signedIn') return <UserMenu />;
  if (isAuthRoute(pathname)) return null;
  return (
    <Button asChild size="sm" data-testid={TEST_IDS.shell.signIn}>
      <Link href={signInHref(pathname)}>{t('account.signIn')}</Link>
    </Button>
  );
}
