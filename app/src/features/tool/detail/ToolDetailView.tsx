import type { Category, Tool, ToolUpdate, WithId } from '@ai-explore/schemas';
import { ReviewsSection } from '@/features/reviews/components/ReviewsSection/ReviewsSection';
import { ToolAbout } from '../components/ToolAbout/ToolAbout';
import { ToolComplementary } from '../components/ToolComplementary/ToolComplementary';
import { ToolHeader } from '../components/ToolHeader/ToolHeader';
import { ToolPlans } from '../components/ToolPlans/ToolPlans';
import { ToolSimilar } from '../components/ToolSimilar/ToolSimilar';
import { ToolTutorials } from '../components/ToolTutorials/ToolTutorials';
import { ToolUpdates } from '../components/ToolUpdates/ToolUpdates';

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
  return (
    <main className="mx-auto flex w-full max-w-content flex-col gap-6 px-4 py-8">
      <ToolHeader tool={tool} category={category} similar={similar} />
      <ToolAbout tool={tool} />
      <ToolPlans tool={tool} />
      <ToolTutorials tool={tool} />
      <ToolUpdates updates={updates} />
      <ReviewsSection toolId={tool.id} />
      <ToolSimilar similar={similar} />
      <ToolComplementary tool={tool} complementary={complementary} />
    </main>
  );
}
