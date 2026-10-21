'use client';

import type { BundlePeriod } from '@ai-explore/schemas';
import { Button, Text } from '@ai-explore/ui';
import { skipToken } from '@reduxjs/toolkit/query';
import { BellRing, Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  useBundleInterestQuery,
  useRegisterInterestMutation,
} from '@/api/endpoints/bundleInterest';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { signInHref } from '@/features/auth/utils/nextParam';
import { Link } from '@/i18n/navigation';
import { notifyMeStyles } from './NotifyMeButton.styles';

export type NotifyMeButtonProps = {
  bundleId: string;
  period: BundlePeriod;
};

export function NotifyMeButton({ bundleId, period }: NotifyMeButtonProps) {
  const t = useTranslations('bundleInterest');
  const errors = useTranslations('errors');
  const { status, user } = useCurrentUser();
  const uid = status === 'signedIn' && user ? user.uid : null;
  const { currentData, isError } = useBundleInterestQuery(uid ? { uid, bundleId } : skipToken);
  const [register, { isLoading: isSaving, error }] = useRegisterInterestMutation();

  if (status === 'signedOut') {
    return (
      <Button size="lg" fullWidth iconLeft={BellRing} asChild className={notifyMeStyles.button}>
        <Link
          href={signInHref(routes.bundle(bundleId))}
          data-testid={TEST_IDS.bundleInterest.notifyMe}
        >
          {t('signInToNotify')}
        </Link>
      </Button>
    );
  }

  if (currentData) {
    return (
      <div className={notifyMeStyles.root} role="status">
        <Check aria-hidden className={notifyMeStyles.icon} />
        <Text
          as="span"
          weight="medium"
          tone="inherit"
          data-testid={TEST_IDS.bundleInterest.registered}
        >
          {t('registered')}
        </Text>
      </div>
    );
  }

  if (!uid || (currentData === undefined && !isError)) {
    return (
      <Button
        size="lg"
        fullWidth
        iconLeft={BellRing}
        loading
        disabled
        className={notifyMeStyles.button}
      >
        {t('notifyMe')}
      </Button>
    );
  }

  return (
    <div className={notifyMeStyles.stack}>
      <Button
        size="lg"
        fullWidth
        iconLeft={BellRing}
        className={notifyMeStyles.button}
        loading={isSaving}
        data-testid={TEST_IDS.bundleInterest.notifyMe}
        onClick={() => register({ uid, bundleId, period })}
      >
        {t('notifyMe')}
      </Button>
      {error && 'code' in error && (
        <Text role="alert" size="sm" tone="danger">
          {errors(error.code)}
        </Text>
      )}
    </div>
  );
}
