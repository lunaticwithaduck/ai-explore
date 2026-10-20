import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { AdminGate } from '@/features/admin/components/AdminGate/AdminGate';
import { NOINDEX } from '@/lib/seo/metadata';

export const metadata: Metadata = { robots: NOINDEX };

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminGate>{children}</AdminGate>;
}
