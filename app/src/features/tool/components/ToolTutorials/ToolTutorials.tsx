import type { Tool } from '@ai-explore/schemas';
import { Card, Carousel, Heading } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { TutorialItem } from '../TutorialItem/TutorialItem';

export type ToolTutorialsProps = {
  tool: Pick<Tool, 'tutorials'>;
};

export function ToolTutorials({ tool }: ToolTutorialsProps) {
  const t = useTranslations('tool.tutorials');
  if (tool.tutorials.length === 0) return null;
  return (
    <Card padding="lg">
      <Carousel
        data-testid={TEST_IDS.tool.tutorials}
        heading={<Heading level={2}>{t('title')}</Heading>}
        previousLabel={t('previous')}
        nextLabel={t('next')}
        previousButtonProps={{ 'data-testid': TEST_IDS.carousel.previous }}
        nextButtonProps={{ 'data-testid': TEST_IDS.carousel.next }}
        slideSize="md"
      >
        {tool.tutorials.map((tutorial) => (
          <TutorialItem key={tutorial.youtubeId} tutorial={tutorial} />
        ))}
      </Carousel>
    </Card>
  );
}
