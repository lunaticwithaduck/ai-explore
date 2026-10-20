import type { Category, WithId } from '@ai-explore/schemas';
import { connection } from 'next/server';
import type { ReactNode } from 'react';
import { getCategories } from '@/api/server/catalogue';
import { ShellFrame } from '../ShellFrame/ShellFrame';

export type AppShellProps = {
  children: ReactNode;
};

async function loadCategories(): Promise<WithId<Category>[]> {
  await connection();
  try {
    return await getCategories();
  } catch (error) {
    console.warn('Shell categories unavailable', error);
    return [];
  }
}

export async function AppShell({ children }: AppShellProps) {
  const categories = await loadCategories();
  return <ShellFrame categories={categories}>{children}</ShellFrame>;
}
