import type { Tool, WithId } from '@ai-explore/schemas';
import { MAX_TAG_CHIPS } from '../config/constants';

export function tagOptions(tools: readonly WithId<Tool>[], selected: readonly string[]): string[] {
  const counts = new Map<string, number>();
  for (const tool of tools) {
    for (const tag of tool.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  const ranked = [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, MAX_TAG_CHIPS)
    .map(([tag]) => tag);
  const extra = selected.filter((tag) => !ranked.includes(tag));
  return [...ranked, ...extra];
}

export function tagLabel(tag: string): string {
  return tag.replaceAll('-', ' ');
}
