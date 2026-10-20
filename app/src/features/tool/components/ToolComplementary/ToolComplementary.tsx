import type { Locale, Tool, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Badge, Card, Text, ToolLogo } from '@ai-explore/ui';
import { ArrowRight } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { Link } from '@/i18n/navigation';
import { ToolSection } from '../ToolSection/ToolSection';

export type ToolComplementaryProps = {
  tool: WithId<Tool>;
  complementary: WithId<Tool>[];
};

export function ToolComplementary({ tool, complementary }: ToolComplementaryProps) {
  const t = useTranslations('tool.complementary');
  const locale = useLocale() as Locale;
  if (complementary.length === 0) return null;
  return (
    <ToolSection
      title={t('title')}
      description={t('description', { name: tool.name })}
      data-testid={TEST_IDS.tool.complementary}
    >
      <ol className="flex flex-col gap-3 lg:flex-row lg:items-stretch">
        <li className="flex items-center gap-3 rounded-card border border-accent bg-accent-subtle p-4 lg:w-56 lg:shrink-0">
          <ToolLogo src={tool.logo.path} alt={tool.name} background={tool.logo.background} />
          <div className="min-w-0">
            <Text weight="medium" clamp={1}>
              {tool.name}
            </Text>
            <Badge tone="solid" size="sm">
              {t('current')}
            </Badge>
          </div>
        </li>
        {complementary.map((other) => (
          <li
            key={other.id}
            className="flex flex-col gap-3 lg:flex-1 lg:flex-row"
            data-id={other.id}
          >
            <span className="flex items-center justify-center gap-2 text-text-muted lg:flex-col">
              <ArrowRight aria-hidden className="size-5 rotate-90 lg:rotate-0" />
              <Text as="span" size="xs" tone="subtle">
                {t('then')}
              </Text>
            </span>
            <Card variant="interactive" padding="sm" asChild>
              <Link href={routes.tool(other.id)} className="flex flex-1 items-center gap-3">
                <ToolLogo
                  src={other.logo.path}
                  alt={other.name}
                  background={other.logo.background}
                />
                <div className="min-w-0">
                  <Text weight="medium" clamp={1}>
                    {other.name}
                  </Text>
                  <Text size="xs" tone="muted" clamp={2}>
                    {pickLocalized(other.tagline, locale)}
                  </Text>
                </div>
              </Link>
            </Card>
          </li>
        ))}
      </ol>
    </ToolSection>
  );
}
