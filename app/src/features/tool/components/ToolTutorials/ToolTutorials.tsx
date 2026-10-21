import type { Tool } from '@ai-explore/schemas';
import { BookOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { ToolCarouselSection } from '../ToolCarouselSection/ToolCarouselSection';
import { TutorialItem } from '../TutorialItem/TutorialItem';

export type ToolTutorialsProps = {
  tool: Pick<Tool, 'tutorials'>;
};

export function ToolTutorials({ tool }: ToolTutorialsProps) {
  const t = useTranslations('tool.tutorials');
  if (tool.tutorials.length === 0) return null;
  return (
    <ToolCarouselSection
      title={t('title')}
      icon={BookOpen}
      previousLabel={t('previous')}
      nextLabel={t('next')}
      buttons="ghost"
      testId={TEST_IDS.tool.tutorials}
    >
      {tool.tutorials.map((tutorial) => (
        <TutorialItem key={tutorial.youtubeId} tutorial={tutorial} />
      ))}
    </ToolCarouselSection>
  );
}
