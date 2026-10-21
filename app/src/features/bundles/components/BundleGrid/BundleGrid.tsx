import type { Bundle, Tool, WithId } from '@ai-explore/schemas';
import { BundleCard } from '../BundleCard/BundleCard';

type BundleGridProps = {
  bundles: WithId<Bundle>[];
  tools: WithId<Tool>[];
};

export function BundleGrid({ bundles, tools }: BundleGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {bundles.map((bundle) => (
        <BundleCard key={bundle.id} bundle={bundle} tools={tools} />
      ))}
    </div>
  );
}
