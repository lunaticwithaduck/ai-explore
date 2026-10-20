import type { Bundle, Tool, WithId } from '@ai-explore/schemas';

export type BundlesSectionProps = {
  bundles: WithId<Bundle>[];
  tools: WithId<Tool>[];
};

export function BundlesSection(_props: BundlesSectionProps) {
  return null;
}
