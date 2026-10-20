import type { Bundle, Tool, WithId } from '@ai-explore/schemas';

export type BundleDetailViewProps = {
  bundle: WithId<Bundle>;
  tools: WithId<Tool>[];
};

export function BundleDetailView(_props: BundleDetailViewProps) {
  return null;
}
