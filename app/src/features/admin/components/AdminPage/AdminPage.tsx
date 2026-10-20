import { BackButton, Heading } from '@ai-explore/ui';
import type { ReactNode } from 'react';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';
import { adminPageStyles } from './AdminPage.styles';

export type AdminPageProps = {
  title: string;
  backLabel?: string | undefined;
  children: ReactNode;
};

export function AdminPage({ title, backLabel, children }: AdminPageProps) {
  return (
    <main className={adminPageStyles.root}>
      {backLabel && (
        <BackButton asChild label={backLabel} size="sm" className="self-start">
          <Link href={routes.admin} />
        </BackButton>
      )}
      <Heading level={1}>{title}</Heading>
      {children}
    </main>
  );
}
