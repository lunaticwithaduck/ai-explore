'use client';

import { type Category, pickLocalized, type Tool, type WithId } from '@ai-explore/schemas';
import { useLocale } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { ToolCard } from '../ToolCard/ToolCard';

export type LibraryGridProps = {
  tools: WithId<Tool>[];
  categories: WithId<Category>[];
};

export function LibraryGrid({ tools, categories }: LibraryGridProps) {
  const locale = useLocale() === 'bg' ? 'bg' : 'en';
  const names = new Map(categories.map((c) => [c.id, pickLocalized(c.name, locale)]));
  return (
    <div
      data-testid={TEST_IDS.library.grid}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      {tools.map((tool) => (
        <ToolCard key={tool.id} tool={tool} categoryName={names.get(tool.categoryId)} />
      ))}
    </div>
  );
}
