import { Heading, Text } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { HEADING_LEVELS, TEXT_SIZES, TEXT_TONES } from '../../config/constants';
import { DemoRow } from '../DemoRow/DemoRow';
import { DemoSection } from '../DemoSection/DemoSection';

export function TypographySection() {
  const t = useTranslations('dev');
  return (
    <DemoSection
      id="typography"
      title={t('typography.title')}
      description={t('typography.description')}
    >
      <DemoRow label={t('typography.headings')} className="flex-col items-start gap-2">
        {HEADING_LEVELS.map((level) => (
          <Heading
            key={level}
            level={level === 1 ? 2 : level}
            size={level === 1 ? '3xl' : undefined}
          >
            {t('typography.heading', { level })}
          </Heading>
        ))}
      </DemoRow>
      <DemoRow label={t('typography.sizes')} className="flex-col items-start gap-1">
        {TEXT_SIZES.map((size) => (
          <Text key={size} size={size}>
            {t('typography.sample', { size })}
          </Text>
        ))}
      </DemoRow>
      <DemoRow label={t('typography.tones')}>
        {TEXT_TONES.map((tone) => (
          <Text key={tone} tone={tone} size="sm" weight="medium">
            {t(`typography.tone.${tone}`)}
          </Text>
        ))}
      </DemoRow>
    </DemoSection>
  );
}
