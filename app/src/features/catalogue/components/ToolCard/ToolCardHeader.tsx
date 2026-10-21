import type { Locale, Tool, WithId } from '@ai-explore/schemas';
import { Text, ToolLogo } from '@ai-explore/ui';
import { Gift } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { toolCardStyles } from './ToolCard.styles';
import { ToolCardRating } from './ToolCardRating';

export type ToolCardHeaderProps = {
  tool: WithId<Tool>;
  locale: Locale;
};

export function ToolCardHeader({ tool, locale }: ToolCardHeaderProps) {
  const t = useTranslations('library');
  return (
    <div className={toolCardStyles.header}>
      <ToolLogo
        src={tool.logo.path}
        alt={tool.name}
        background={tool.logo.background}
        data-testid={TEST_IDS.library.cardLogo}
        className={toolCardStyles.logo}
      />
      <ToolCardRating rating={tool.rating} locale={locale} />
      {tool.pricing.hasFreePlan && (
        <div className={toolCardStyles.free}>
          <Gift aria-hidden className={toolCardStyles.freeIcon} />
          <Text as="span" size="xs" tone="inherit">
            {t('card.free')}
          </Text>
        </div>
      )}
    </div>
  );
}
