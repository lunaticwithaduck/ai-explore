import type { Tool, WithId } from '@ai-explore/schemas';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { ToolCard } from '@/features/catalogue/components/ToolCard/ToolCard';
import { ToolCarouselSection } from '../ToolCarouselSection/ToolCarouselSection';

export type ToolSimilarProps = {
  similar: WithId<Tool>[];
};

export function ToolSimilar({ similar }: ToolSimilarProps) {
  const t = useTranslations('tool.similar');
  if (similar.length === 0) return null;
  return (
    <ToolCarouselSection
      title={t('title')}
      previousLabel={t('previous')}
      nextLabel={t('next')}
      buttons="solid"
      testId={TEST_IDS.tool.similar}
    >
      {similar.map((tool) => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </ToolCarouselSection>
  );
}
