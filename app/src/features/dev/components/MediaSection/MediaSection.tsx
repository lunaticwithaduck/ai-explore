import { Image, Text, ToolLogo } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { SAMPLE_COVER, SAMPLE_LOGOS, SIZES } from '../../config/constants';
import { DemoRow } from '../DemoRow/DemoRow';
import { DemoSection } from '../DemoSection/DemoSection';

export function MediaSection() {
  const t = useTranslations('dev');
  return (
    <DemoSection id="media" title={t('media.title')} description={t('media.description')} wide>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DemoRow label={t('media.logoSizes')} className="items-end gap-4">
          {SIZES.map((size) => (
            <ToolLogo
              key={size}
              size={size}
              src={SAMPLE_LOGOS[0].src}
              alt={t('media.logoAlt')}
              background={SAMPLE_LOGOS[0].background}
            />
          ))}
          <ToolLogo
            size="md"
            shape="circle"
            src={SAMPLE_LOGOS[1].src}
            alt={t('media.logoAlt')}
            background={SAMPLE_LOGOS[1].background}
          />
        </DemoRow>
        <DemoRow label={t('media.logoAspect')} className="gap-4">
          {SAMPLE_LOGOS.map((logo) => (
            <div key={logo.id} className="flex flex-col items-center gap-2">
              <ToolLogo
                size="lg"
                src={logo.src}
                alt={t('media.logoAlt')}
                background={logo.background}
              />
              <Text as="span" size="xs" tone="subtle">
                {t(`media.aspect.${logo.id}`)}
              </Text>
            </div>
          ))}
        </DemoRow>
        <DemoRow label={t('media.image')}>
          <div className="w-full max-w-sm overflow-hidden rounded-card bg-accent-blue-subtle">
            <Image
              src={SAMPLE_COVER}
              alt={t('media.coverAlt')}
              fit="cover"
              className="aspect-video w-full"
            />
          </div>
        </DemoRow>
      </div>
    </DemoSection>
  );
}
