'use client';

import type { Category, WithId } from '@ai-explore/schemas';
import { IconButton, Label, Sheet } from '@ai-explore/ui';
import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { TEST_IDS } from '@/config/test-ids';
import { BrandLink } from '../BrandLink/BrandLink';
import { HeaderSearch } from '../HeaderSearch/HeaderSearch';
import { LocaleSwitcher } from '../LocaleSwitcher/LocaleSwitcher';
import { Sidebar } from '../Sidebar/Sidebar';

export type MobileNavProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: WithId<Category>[];
};

export function MobileNav({ open, onOpenChange, categories }: MobileNavProps) {
  const t = useTranslations('shell');
  return (
    <Sheet
      side="left"
      open={open}
      onOpenChange={onOpenChange}
      title={t('header.menuTitle')}
      hideTitle
      closeLabel={t('header.closeMenu')}
      header={<BrandLink />}
      trigger={
        <IconButton
          icon={Menu}
          label={t('header.openMenu')}
          className="lg:hidden"
          data-testid={TEST_IDS.shell.mobileMenuButton}
        />
      }
    >
      <div className="flex flex-col gap-6">
        <HeaderSearch />
        <Sidebar categories={categories} />
        <div className="flex flex-col gap-2 border-border border-t pt-5">
          <Label htmlFor="mobile-locale" size="sm" tone="muted">
            {t('locale.label')}
          </Label>
          <LocaleSwitcher id="mobile-locale" className="w-full" />
        </div>
      </div>
    </Sheet>
  );
}
