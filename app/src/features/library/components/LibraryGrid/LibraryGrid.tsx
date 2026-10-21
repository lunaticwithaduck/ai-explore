'use client';

import type { Tool, WithId } from '@ai-explore/schemas';
import { TEST_IDS } from '@/config/test-ids';
import { ToolCard } from '@/features/catalogue/components/ToolCard/ToolCard';
import { SaveToolButton } from '@/features/my-library/components/SaveToolButton/SaveToolButton';

export type LibraryGridProps = {
  tools: WithId<Tool>[];
};

export function LibraryGrid({ tools }: LibraryGridProps) {
  return (
    <div
      data-testid={TEST_IDS.library.grid}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} actions={<SaveToolButton toolId={tool.id} />} />
      ))}
    </div>
  );
}
