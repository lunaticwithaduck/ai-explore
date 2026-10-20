import type { Bundle, Locale, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { accentSubtleClass, BackButton, cn, Heading, Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { bundleIcon } from '../../config/icons';

type BundleHeaderProps = {
  bundle: WithId<Bundle>;
};

export function BundleHeader({ bundle }: BundleHeaderProps) {
  const t = useTranslations('bundles');
  const locale = useLocale() as Locale;
  const Icon = bundleIcon(bundle.icon);
  return (
    <header className="flex flex-col gap-4">
      <BackButton asChild label={t('detail.back')} size="sm" className="self-start">
        <Link href={routes.bundles} />
      </BackButton>
      <div className="flex items-start gap-4">
        <span
          className={cn(
            'flex size-14 shrink-0 items-center justify-center rounded-card',
            accentSubtleClass[bundle.accent],
          )}
        >
          <Icon aria-hidden className="size-7" />
        </span>
        <div className="flex flex-col gap-2">
          <Heading level={1}>{pickLocalized(bundle.name, locale)}</Heading>
          <Text tone="muted" className="max-w-prose">
            {pickLocalized(bundle.description, locale)}
          </Text>
        </div>
      </div>
    </header>
  );
}
