'use client';

import type { Category, WithId } from '@ai-explore/schemas';
import { TEST_IDS } from '@/config/test-ids';
import { NotificationsBell } from '@/features/notifications/components/NotificationsBell/NotificationsBell';
import { AccountArea } from '../AccountArea/AccountArea';
import { BrandLink } from '../BrandLink/BrandLink';
import { HeaderSearch } from '../HeaderSearch/HeaderSearch';
import { LocaleSwitcher } from '../LocaleSwitcher/LocaleSwitcher';
import { MobileNav } from '../MobileNav/MobileNav';
import { headerStyles } from './Header.styles';

export type HeaderProps = {
  categories: WithId<Category>[];
  menuOpen: boolean;
  onMenuOpenChange: (open: boolean) => void;
};

export function Header({ categories, menuOpen, onMenuOpenChange }: HeaderProps) {
  return (
    <header data-testid={TEST_IDS.shell.header} className={headerStyles.root}>
      <div className={headerStyles.start}>
        <MobileNav open={menuOpen} onOpenChange={onMenuOpenChange} categories={categories} />
        <BrandLink />
      </div>
      {!menuOpen && (
        <HeaderSearch className={headerStyles.search} inputClassName={headerStyles.searchInput} />
      )}
      <div className={headerStyles.end}>
        <NotificationsBell />
        {!menuOpen && (
          <div className={headerStyles.locale}>
            <LocaleSwitcher />
          </div>
        )}
        <AccountArea />
      </div>
    </header>
  );
}
