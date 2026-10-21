import { useTranslations } from 'next-intl';
import { NotFoundContent } from './NotFoundContent';

export function NotFoundView() {
  const t = useTranslations('system');
  return (
    <NotFoundContent title={t('notFoundTitle')} body={t('notFoundBody')} action={t('goHome')} />
  );
}
