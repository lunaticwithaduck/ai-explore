import type { Bundle, Locale, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { BackButton, cn, Heading, Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { BUNDLE_GRADIENTS } from '../../config/gradients';
import { bundleIcon } from '../../config/icons';
import { bundleHeaderStyles } from './BundleHeader.styles';

type BundleHeaderProps = {
  bundle: WithId<Bundle>;
};

export function BundleHeader({ bundle }: BundleHeaderProps) {
  const t = useTranslations('bundles');
  const locale = useLocale() as Locale;
  const gradient = BUNDLE_GRADIENTS[bundle.accent];
  const Icon = bundleIcon(bundle.icon);
  return (
    <header className={bundleHeaderStyles.root}>
      <div className={cn(bundleHeaderStyles.banner, gradient)}>
        <span aria-hidden className={bundleHeaderStyles.fade} />
        <BackButton asChild label={t('detail.back')} size="md" className={bundleHeaderStyles.back}>
          <Link href={routes.bundles} />
        </BackButton>
        <span className={cn(bundleHeaderStyles.tile, gradient)}>
          <Icon aria-hidden className={bundleHeaderStyles.icon} />
        </span>
      </div>
      <div className={bundleHeaderStyles.intro}>
        <Heading level={1}>{pickLocalized(bundle.name, locale)}</Heading>
        <Text size="lg" tone="muted">
          {pickLocalized(bundle.description, locale)}
        </Text>
      </div>
    </header>
  );
}
