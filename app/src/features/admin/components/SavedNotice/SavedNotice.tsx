import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { AuthAlert } from '@/features/auth/components/AuthAlert/AuthAlert';

export type SavedNoticeProps = {
  saved: boolean;
};

export function SavedNotice({ saved }: SavedNoticeProps) {
  const t = useTranslations('admin');
  if (!saved) return null;
  return <AuthAlert tone="success" message={t('form.saved')} data-testid={TEST_IDS.admin.saved} />;
}
