import { Skeleton } from '@ai-explore/ui';
import { skeletonStyles } from './Skeleton.styles';

const CARDS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const;

export function LibrarySkeleton() {
  return (
    <main className={skeletonStyles.page} aria-busy="true">
      <div className="flex flex-col gap-2">
        <Skeleton shape="text" className="h-8 w-56" />
        <Skeleton shape="text" className="h-4 w-64 max-w-full" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className={skeletonStyles.grid}>
        {CARDS.map((id) => (
          <Skeleton key={id} shape="card" className="h-36" />
        ))}
      </div>
    </main>
  );
}
