import type { Locale, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Card, Text, ToolLogo } from '@ai-explore/ui';
import { useLocale } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { useStartingPriceLabel } from '../../hooks/useStartingPriceLabel';
import { complementaryCardStyles as styles } from './ComplementaryCard.styles';

export type ComplementaryCardProps = {
  tool: WithId<Tool>;
};

export function ComplementaryCard({ tool }: ComplementaryCardProps) {
  const locale = useLocale() as Locale;
  const price = useStartingPriceLabel(tool.pricing);
  return (
    <Card asChild variant="flat" padding="none" className={styles.root}>
      <Link href={routes.tool(tool.id)}>
        <span className="flex items-start gap-3">
          <ToolLogo
            aria-hidden
            src={tool.logo.path}
            alt={tool.name}
            background={tool.logo.background}
          />
          <span className="flex min-w-0 flex-col gap-1">
            <Text as="span" size="sm" weight="medium" clamp={1}>
              {tool.name}
            </Text>
            <Text as="span" size="xs" numeric>
              {price}
            </Text>
          </span>
        </span>
        <Text as="span" size="xs" tone="muted" clamp={2}>
          {pickLocalized(tool.tagline, locale)}
        </Text>
      </Link>
    </Card>
  );
}
