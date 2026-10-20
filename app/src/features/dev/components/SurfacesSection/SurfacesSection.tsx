import { ACCENT_NAMES, Badge, Card, Heading, Text } from '@ai-explore/ui';
import { Gift, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { BADGE_TONES, CARD_VARIANTS } from '../../config/constants';
import { DemoRow } from '../DemoRow/DemoRow';
import { DemoSection } from '../DemoSection/DemoSection';
import { TagsDemo } from '../TagsDemo/TagsDemo';

export function SurfacesSection() {
  const t = useTranslations('dev');
  return (
    <DemoSection id="surfaces" title={t('surfaces.title')} description={t('surfaces.description')}>
      <DemoRow label={t('surfaces.cards')} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {CARD_VARIANTS.map((variant) => (
          <Card
            key={variant}
            variant={variant}
            padding="sm"
            tabIndex={variant === 'interactive' ? 0 : undefined}
            className="flex h-full flex-col gap-1"
          >
            <Heading level={3} size="sm">
              {t(`surfaces.card.${variant}`)}
            </Heading>
            <Text size="xs" tone="muted">
              {t(`surfaces.cardHint.${variant}`)}
            </Text>
          </Card>
        ))}
      </DemoRow>
      <DemoRow label={t('surfaces.badges')}>
        {BADGE_TONES.map((tone) => (
          <Badge key={tone} tone={tone}>
            {t(`surfaces.badge.${tone}`)}
          </Badge>
        ))}
        <Badge tone="success" icon={Gift} size="sm">
          {t('surfaces.free')}
        </Badge>
        <Badge tone="solid" icon={Sparkles} size="sm">
          {t('surfaces.new')}
        </Badge>
      </DemoRow>
      <DemoRow label={t('surfaces.accentBadges')}>
        {ACCENT_NAMES.map((accent) => (
          <Badge key={accent} accent={accent}>
            {t(`surfaces.accent.${accent}`)}
          </Badge>
        ))}
      </DemoRow>
      <DemoRow label={t('surfaces.tags')}>
        <TagsDemo />
      </DemoRow>
    </DemoSection>
  );
}
