'use client';

import type { Category, WithId } from '@ai-explore/schemas';
import { type ReactNode, Suspense, useCallback, useState } from 'react';
import { AuthListener } from '@/features/auth/components/AuthListener/AuthListener';
import { Header } from '../Header/Header';
import { NavigationWatcher } from '../NavigationWatcher/NavigationWatcher';
import { Sidebar } from '../Sidebar/Sidebar';
import { shellFrameStyles } from './ShellFrame.styles';

export type ShellFrameProps = {
  categories: WithId<Category>[];
  children: ReactNode;
};

export function ShellFrame({ categories, children }: ShellFrameProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <AuthListener />
      <Suspense fallback={null}>
        <NavigationWatcher onNavigate={closeMenu} />
      </Suspense>
      <div className={shellFrameStyles.root}>
        <Header categories={categories} menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
        <div className={shellFrameStyles.body}>
          {!menuOpen && (
            <div className={shellFrameStyles.sidebarColumn}>
              <aside className={shellFrameStyles.sidebar}>
                <div className={shellFrameStyles.sidebarScroll}>
                  <Sidebar categories={categories} />
                </div>
              </aside>
            </div>
          )}
          <div className={shellFrameStyles.content}>{children}</div>
        </div>
      </div>
    </>
  );
}
