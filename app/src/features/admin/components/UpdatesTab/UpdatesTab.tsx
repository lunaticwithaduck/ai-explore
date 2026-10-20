import { Button, Text } from '@ai-explore/ui';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { adminRowStyles } from '../AdminRow/AdminRow.styles';

export function UpdatesTab() {
  const t = useTranslations('admin');
  return (
    <section className="flex flex-col gap-4">
      <div className={adminRowStyles.toolbar}>
        <Text tone="muted">{t('updates.hint')}</Text>
        <Button asChild size="sm" iconLeft={Plus}>
          <Link href={routes.adminNewUpdate}>{t('updates.new')}</Link>
        </Button>
      </div>
    </section>
  );
}
