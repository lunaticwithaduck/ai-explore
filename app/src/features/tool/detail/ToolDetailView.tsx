import type { Category, Tool, ToolUpdate, WithId } from '@ai-explore/schemas';

export type ToolDetailViewProps = {
  tool: WithId<Tool>;
  category: WithId<Category> | null;
  updates: WithId<ToolUpdate>[];
  similar: WithId<Tool>[];
  complementary: WithId<Tool>[];
};

export function ToolDetailView(_props: ToolDetailViewProps) {
  return null;
}
