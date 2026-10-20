import { Text, TextLink } from '@ai-explore/ui';
import { Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { brandLinkStyles } from './BrandLink.styles';

export function BrandLink() {
  const common = useTranslations('common');
  const t = useTranslations('shell');
  return (
    <TextLink asChild tone="default" underline="none" className={brandLinkStyles.link}>
      <Link href={routes.library} aria-label={t('brandHome')}>
        <span aria-hidden className={brandLinkStyles.mark}>
          <Sparkles className={brandLinkStyles.icon} />
        </span>
        <Text as="span" size="lg" weight="semibold" className={brandLinkStyles.name}>
          {common('appName')}
        </Text>
      </Link>
    </TextLink>
  );
}
