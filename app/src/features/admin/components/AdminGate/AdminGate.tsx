'use client';

import { BackButton, Heading, Skeleton, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { type ReactNode, useEffect } from 'react';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useIsAdmin } from '@/features/auth/hooks/useIsAdmin';
import { signInHref } from '@/features/auth/utils/nextParam';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { adminGateStyles } from './AdminGate.styles';

export type AdminGateProps = {
  children: ReactNode;
};

export function AdminGate({ children }: AdminGateProps) {
  const t = useTranslations('admin');
  const { status } = useCurrentUser();
  const { isAdmin, isLoading } = useIsAdmin();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'signedOut') router.replace(signInHref(pathname));
  }, [status, pathname, router]);

  if (status !== 'signedIn' || isLoading) {
    return (
      <main aria-busy="true" className={adminGateStyles.page}>
        <Text as="span" role="status" className="sr-only">
          {t('gate.loading')}
        </Text>
        <Skeleton shape="text" className="h-8 w-56" />
        <Skeleton shape="card" className="h-40" />
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className={adminGateStyles.page} data-testid={TEST_IDS.admin.forbidden}>
        <Heading level={1}>{t('forbidden.title')}</Heading>
        <Text tone="muted">{t('forbidden.body')}</Text>
        <BackButton asChild label={t('forbidden.back')} className="self-start">
          <Link href={routes.library} />
        </BackButton>
      </main>
    );
  }

  return children;
}
