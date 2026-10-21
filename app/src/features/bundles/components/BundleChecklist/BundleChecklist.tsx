import type { Tool, WithId } from '@ai-explore/schemas';
import { Text } from '@ai-explore/ui';
import { Check } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { bundleChecklistStyles } from './BundleChecklist.styles';

type BundleChecklistProps = {
  tools: WithId<Tool>[];
};

export function BundleChecklist({ tools }: BundleChecklistProps) {
  const t = useTranslations('bundles');
  if (tools.length === 0) return null;
  return (
    <ul className={bundleChecklistStyles.list} aria-label={t('detail.checklist')}>
      {tools.map((tool) => (
        <li key={tool.id} className={bundleChecklistStyles.item}>
          <span className={bundleChecklistStyles.mark}>
            <Check aria-hidden className={bundleChecklistStyles.check} />
          </span>
          <Text as="span" size="sm">
            {tool.name}
          </Text>
        </li>
      ))}
    </ul>
  );
}
