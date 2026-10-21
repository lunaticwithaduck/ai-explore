import { Card, cn } from '@ai-explore/ui';
import type { ReactNode } from 'react';

export type ProfileTileProps = {
  className?: string | undefined;
  children: ReactNode;
};

export function ProfileTile({ className, children }: ProfileTileProps) {
  return (
    <Card
      variant="interactive"
      padding="none"
      className={cn('h-full rounded-button p-4 hover:scale-100', className)}
    >
      {children}
    </Card>
  );
}
