import type { Tool, WithId } from '@ai-explore/schemas';
import { defaultSecondTool } from './resolveCompare';

export function suggestedPairs(
  tools: readonly WithId<Tool>[],
  limit: number,
): [WithId<Tool>, WithId<Tool>][] {
  const pairs: [WithId<Tool>, WithId<Tool>][] = [];
  const seen = new Set<string>();
  for (const tool of tools) {
    if (pairs.length >= limit) break;
    const other = defaultSecondTool(tools, tool);
    if (!other) continue;
    const key = [tool.id, other.id].sort().join('|');
    if (seen.has(key)) continue;
    seen.add(key);
    pairs.push([tool, other]);
  }
  return pairs;
}
