import type { ReactNode } from 'react';
import { AdminGate } from '@/features/admin/components/AdminGate/AdminGate';

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminGate>{children}</AdminGate>;
}
