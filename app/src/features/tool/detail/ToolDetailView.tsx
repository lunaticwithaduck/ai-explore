import type { Category, Locale, Tool, ToolUpdate, WithId } from '@ai-explore/schemas';
import { pickLocalized } from '@ai-explore/schemas';
import { useLocale } from 'next-intl';
import { ReviewsSection } from '@/features/reviews/components/ReviewsSection/ReviewsSection';
import { ToolJsonLd } from '@/lib/seo/ToolJsonLd';
import { ToolAbout } from '../components/ToolAbout/ToolAbout';
import { ToolComplementary } from '../components/ToolComplementary/ToolComplementary';
import { ToolHeader } from '../components/ToolHeader/ToolHeader';
import { ToolHero } from '../components/ToolHero/ToolHero';
import { ToolPlans } from '../components/ToolPlans/ToolPlans';
import { ToolSimilar } from '../components/ToolSimilar/ToolSimilar';
import { ToolStats } from '../components/ToolStats/ToolStats';
import { ToolTutorials } from '../components/ToolTutorials/ToolTutorials';
import { ToolUpdates } from '../components/ToolUpdates/ToolUpdates';
import { toolDetailViewStyles as styles } from './ToolDetailView.styles';

export type ToolDetailViewProps = {
  tool: WithId<Tool>;
  category: WithId<Category> | null;
  updates: WithId<ToolUpdate>[];
  similar: WithId<Tool>[];
  complementary: WithId<Tool>[];
};

export function ToolDetailView({
  tool,
  category,
  updates,
  similar,
  complementary,
}: ToolDetailViewProps) {
  const locale = useLocale() as Locale;
  return (
    <main className={styles.root}>
      <ToolJsonLd tool={tool} />
      <ToolHero tool={tool} />
      <div className={styles.body}>
        <ToolHeader tool={tool} compareWithId={similar[0]?.id} />
        <div className={styles.overview}>
          <ToolAbout tool={tool} className={styles.about} />
          <ToolStats
            toolId={tool.id}
            rating={tool.rating}
            categoryName={category ? pickLocalized(category.name, locale) : null}
            pricing={tool.pricing}
          />
        </div>
        <ToolPlans tool={tool} />
        <ToolTutorials tool={tool} />
        <ToolUpdates updates={updates} />
        <ToolSimilar similar={similar} />
        <ToolComplementary tool={tool} complementary={complementary} />
        <ReviewsSection toolId={tool.id} />
      </div>
    </main>
  );
}
