import type { Locale, Tool } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { Heading, Text } from '@ai-explore/ui';
import { Check } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { ToolSection } from '../ToolSection/ToolSection';

export type ToolAboutProps = {
  tool: Pick<Tool, 'description' | 'features'>;
};

export function ToolAbout({ tool }: ToolAboutProps) {
  const t = useTranslations('tool.about');
  const locale = useLocale() as Locale;
  return (
    <ToolSection title={t('title')}>
      <Text tone="muted" className="leading-relaxed">
        {pickLocalized(tool.description, locale)}
      </Text>
      {tool.features.length > 0 && (
        <div className="mt-6">
          <Heading level={3} size="md" className="mb-3">
            {t('features')}
          </Heading>
          <ul className="grid gap-2 sm:grid-cols-2">
            {tool.features.map((feature) => (
              <li key={feature.en} className="flex items-start gap-2">
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                <Text as="span" size="sm" tone="muted">
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
