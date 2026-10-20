import type { Tool, WithId } from '@ai-explore/schemas';
import { Card, Carousel, Heading } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { ToolCard } from '@/features/catalogue/components/ToolCard/ToolCard';
import { SaveToolButton } from '@/features/my-library/components/SaveToolButton/SaveToolButton';

export type ToolSimilarProps = {
  similar: WithId<Tool>[];
};

export function ToolSimilar({ similar }: ToolSimilarProps) {
  const t = useTranslations('tool.similar');
  if (similar.length === 0) return null;
  return (
    <Card padding="lg">
      <Carousel
        data-testid={TEST_IDS.tool.similar}
        heading={<Heading level={2}>{t('title')}</Heading>}
        previousLabel={t('previous')}
        nextLabel={t('next')}
        previousButtonProps={{ 'data-testid': TEST_IDS.carousel.previous }}
        nextButtonProps={{ 'data-testid': TEST_IDS.carousel.next }}
        slideSize="sm"
      >
        {similar.map((tool) => (
          <ToolCard key={tool.id} tool={tool} actions={<SaveToolButton toolId={tool.id} />} />
        ))}
      </Carousel>
    </Card>
  );
}
