import { Skeleton } from '@ai-explore/ui';
import { skeletonStyles } from './Skeleton.styles';

export function ToolSkeleton() {
  return (
    <main className={skeletonStyles.page} aria-busy="true">
      <Skeleton shape="card" className="h-56" />
      <Skeleton shape="card" className="h-40" />
      <Skeleton shape="card" className="h-64" />
    </main>
  );
}
