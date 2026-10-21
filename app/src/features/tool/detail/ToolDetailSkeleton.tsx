import { Skeleton } from '@ai-explore/ui';
import { toolDetailViewStyles as styles } from './ToolDetailView.styles';

export function ToolDetailSkeleton() {
  return (
    <main className={styles.root} aria-busy="true">
      <Skeleton className="h-56 w-full rounded-none sm:h-80" />
      <div className={styles.body}>
        <Skeleton shape="card" className="h-80 border border-border bg-surface" />
        <div className={styles.overview}>
          <Skeleton shape="card" className="h-72 lg:col-span-2" />
          <Skeleton shape="card" className="h-72" />
        </div>
      </div>
    </main>
  );
}
