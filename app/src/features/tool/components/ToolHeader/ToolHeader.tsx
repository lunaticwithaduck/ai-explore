import type { Locale, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Card, Heading, Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { useStartingPriceLabel } from '../../hooks/useStartingPriceLabel';
import { ToolActions } from '../ToolActions/ToolActions';
import { ToolHeaderMeta } from '../ToolHeaderMeta/ToolHeaderMeta';
import { ToolHeaderRating } from '../ToolHeaderRating/ToolHeaderRating';
import { ToolTags } from '../ToolTags/ToolTags';
import { toolHeaderStyles as styles } from './ToolHeader.styles';

export type ToolHeaderProps = {
  tool: WithId<Tool>;
  compareWithId: string | undefined;
};

export function ToolHeader({ tool, compareWithId }: ToolHeaderProps) {
  const t = useTranslations('tool.header');
  const locale = useLocale() as Locale;
  const price = useStartingPriceLabel(tool.pricing);
  return (
    <Card asChild padding="lg">
      <header data-testid={TEST_IDS.tool.header} className={styles.root}>
        <div className={styles.top}>
          <div className={styles.intro}>
            <Heading level={1} className={styles.name}>
              {tool.name}
            </Heading>
            <Text tone="muted">{pickLocalized(tool.tagline, locale)}</Text>
          </div>
          <div className={styles.aside}>
            <Text numeric className={styles.price}>
              <span className="sr-only">{t('priceLabel')} </span>
              {price}
            </Text>
            <ToolHeaderRating toolId={tool.id} initial={tool.rating} />
          </div>
        </div>
        <ToolHeaderMeta developer={tool.developer} updatedAt={tool.lastReleaseAt} />
        <ToolTags tags={tool.tags} />
        <ToolActions tool={tool} compareWithId={compareWithId} />
      </header>
    </Card>
  );
}
