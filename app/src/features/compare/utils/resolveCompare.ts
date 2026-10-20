import type { Tool, WithId } from '@ai-explore/schemas';

export type ComparePair = {
  first: WithId<Tool> | undefined;
  second: WithId<Tool> | undefined;
};

const findTool = (tools: readonly WithId<Tool>[], id: string | undefined) =>
  id ? tools.find((tool) => tool.id === id || tool.slug === id) : undefined;

export function defaultSecondTool(
  tools: readonly WithId<Tool>[],
  first: WithId<Tool>,
): WithId<Tool> | undefined {
  for (const id of first.similarToolIds) {
    const candidate = findTool(tools, id);
    if (candidate && candidate.id !== first.id) return candidate;
  }
  return undefined;
}

export function resolveCompare(
  tools: readonly WithId<Tool>[],
  firstId: string | undefined,
  secondId: string | undefined,
): ComparePair {
  const first = findTool(tools, firstId);
  if (!first) return { first: undefined, second: undefined };
  const requested = findTool(tools, secondId);
  const second =
    requested && requested.id !== first.id ? requested : defaultSecondTool(tools, first);
  return { first, second };
}
