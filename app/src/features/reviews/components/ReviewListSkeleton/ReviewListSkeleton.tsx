import { Skeleton } from '@ai-explore/ui';
import { reviewListSkeletonStyles as styles } from './ReviewListSkeleton.styles';

const ROWS = [0, 1] as const;

export type ReviewListSkeletonProps = {
  label: string;
};

export function ReviewListSkeleton({ label }: ReviewListSkeletonProps) {
  return (
    <div role="status" aria-label={label} className={styles.root}>
      {ROWS.map((row) => (
        <div key={row} className={styles.row}>
          <Skeleton shape="circle" className={styles.avatar} />
          <div className={styles.lines}>
            <Skeleton shape="text" className={styles.name} />
            <Skeleton shape="text" className={styles.line} />
            <Skeleton shape="text" className={styles.shortLine} />
          </div>
        </div>
      ))}
    </div>
  );
}
