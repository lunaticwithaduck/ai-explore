import { cn } from '@ai-explore/ui';
import type { ReactNode } from 'react';
import { accountPageStyles as styles } from './AccountPage.styles';

export type AccountPageProps = {
  tone: 'profile' | 'settings';
  width: 'wide' | 'narrow';
  back: ReactNode;
  children: ReactNode;
};

export function AccountPage({ tone, width, back, children }: AccountPageProps) {
  return (
    <main className={styles.main}>
      <div className={cn(styles.banner, styles.gradient[tone])}>
        <div aria-hidden className={styles.fade} />
        <div className={styles.back}>{back}</div>
      </div>
      <div className={cn(styles.body, styles.width[width])}>{children}</div>
    </main>
  );
}
