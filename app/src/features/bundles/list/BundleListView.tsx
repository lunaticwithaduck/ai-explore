import type { Bundle, Tool, WithId } from '@ai-explore/schemas';

export type BundleListViewProps = {
  bundles: WithId<Bundle>[];
  tools: WithId<Tool>[];
};

export function BundleListView(_props: BundleListViewProps) {
  return null;
}
