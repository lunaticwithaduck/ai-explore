'use client';

import type { Tool, WithId } from '@ai-explore/schemas';
import { Text, TextLink } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { suggestedPairs } from '../../utils/suggestedPairs';

export type CompareSuggestionsProps = {
  tools: readonly WithId<Tool>[];
};

export function CompareSuggestions({ tools }: CompareSuggestionsProps) {
  const t = useTranslations('compare');
  const pairs = suggestedPairs(tools, 3);
  return (
    <div className="flex flex-col gap-2">
      <Text size="sm" tone="muted">
        {t('emptyHint')}
      </Text>
      {pairs.length > 0 && (
        <>
          <Text size="sm" weight="medium">
            {t('suggestionsTitle')}
          </Text>
          <ul className="flex flex-col gap-1">
            {pairs.map(([a, b]) => (
              <li key={`${a.id}-${b.id}`}>
                <TextLink asChild>
                  <Link href={routes.compare(a.slug, b.slug)}>
                    {t('suggestion', { first: a.name, second: b.name })}
                  </Link>
                </TextLink>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
