import type { Locale, Tool } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Heading, Text } from '@ai-explore/ui';
import { useLocale, useTranslations } from 'next-intl';
import { ToolSection } from '../ToolSection/ToolSection';

export type ToolAboutProps = {
  tool: Pick<Tool, 'description' | 'features'>;
  className?: string | undefined;
};

export function ToolAbout({ tool, className }: ToolAboutProps) {
  const t = useTranslations('tool.about');
  const locale = useLocale() as Locale;
  return (
    <ToolSection title={t('title')} spacing="sm" className={className}>
      <Text tone="muted" className="leading-relaxed">
        {pickLocalized(tool.description, locale)}
      </Text>
      {tool.features.length > 0 && (
        <div className="mt-6">
          <Heading level={3} className="mb-3">
            {t('features')}
          </Heading>
          <ul className="flex flex-col gap-2">
            {tool.features.map((feature) => (
              <li key={feature.en} className="flex items-start gap-2">
                <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                <Text as="span" tone="muted">
                  {pickLocalized(feature, locale)}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ToolSection>
  );
}
