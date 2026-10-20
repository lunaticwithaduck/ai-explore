import {
  type Bundle,
  type BundlePeriod,
  type BundlePeriodSummary,
  summarizeBundlePeriod,
  type Tool,
  type WithId,
} from '@ai-explore/schemas';

export function includedTools(bundle: Bundle, tools: readonly WithId<Tool>[]): WithId<Tool>[] {
  return bundle.toolIds
    .map((id) => tools.find((tool) => tool.id === id))
    .filter((tool): tool is WithId<Tool> => tool !== undefined);
}

export function summarizeBundle(
  bundle: Bundle,
  tools: readonly WithId<Tool>[],
  period: BundlePeriod,
): BundlePeriodSummary {
  return summarizeBundlePeriod(
    bundle.pricing[period].priceCents,
    tools.map((tool) => tool.pricing.fromPriceCents),
    period,
  );
}
