import { Button, IconButton } from '@ai-explore/ui';
import { Bell, ExternalLink, Heart, Plus, Settings, Share2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { BUTTON_VARIANTS, SIZES } from '../../config/constants';
import { DemoRow } from '../DemoRow/DemoRow';
import { DemoSection } from '../DemoSection/DemoSection';

export function ButtonsSection() {
  const t = useTranslations('dev');
  return (
    <DemoSection id="buttons" title={t('buttons.title')} description={t('buttons.description')}>
      <DemoRow label={t('buttons.variants')}>
        {BUTTON_VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            {t(`buttons.variant.${variant}`)}
          </Button>
        ))}
      </DemoRow>
      <DemoRow label={t('buttons.sizes')}>
        {SIZES.map((size) => (
          <Button key={size} size={size} variant="secondary">
            {t(`sizes.${size}`)}
          </Button>
        ))}
      </DemoRow>
      <DemoRow label={t('buttons.withIcons')}>
        <Button iconLeft={Plus}>{t('buttons.addToLibrary')}</Button>
        <Button variant="secondary" iconRight={ExternalLink} asChild>
          <Link href={routes.bundles}>{t('buttons.asChildLink')}</Link>
        </Button>
      </DemoRow>
      <DemoRow label={t('buttons.states')}>
        <Button loading>{t('buttons.saving')}</Button>
        <Button variant="secondary" disabled>
          {t('buttons.disabled')}
        </Button>
        <Button variant="ghost" iconLeft={Share2}>
          {t('buttons.share')}
        </Button>
      </DemoRow>
      <DemoRow label={t('buttons.iconButtons')}>
        <IconButton icon={Heart} label={t('buttons.save')} variant="primary" />
        <IconButton icon={Share2} label={t('buttons.share')} variant="secondary" />
        <IconButton icon={Bell} label={t('buttons.notifications')} />
        <IconButton
          icon={Settings}
          label={t('buttons.settings')}
          variant="secondary"
          shape="circle"
        />
        {SIZES.map((size) => (
          <IconButton
            key={size}
            icon={Plus}
            label={t(`sizes.${size}`)}
            size={size}
            variant="secondary"
          />
        ))}
      </DemoRow>
    </DemoSection>
  );
}
