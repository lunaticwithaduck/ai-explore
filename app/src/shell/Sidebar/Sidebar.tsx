'use client';

import { type Category, pickLocalized, type WithId } from '@ai-explore/schemas';
import { Columns2, Heart, LayoutGrid, Package } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { useAppLocale } from '@/features/auth/hooks/useAppLocale';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { SidebarCollections } from '@/features/my-library/components/SidebarCollections/SidebarCollections';
import { categoryIcon } from '../config/constants';
import { useActiveNav } from '../hooks/useActiveNav';
import { SidebarLink } from '../SidebarLink/SidebarLink';
import { SidebarSection } from '../SidebarSection/SidebarSection';

export type SidebarProps = {
  categories: WithId<Category>[];
};

export function Sidebar({ categories }: SidebarProps) {
  const t = useTranslations('shell');
  const locale = useAppLocale();
  const { status } = useCurrentUser();
  const { pathname, category, collection } = useActiveNav();
  const onLibrary = pathname === routes.library;

  return (
    <nav
      aria-label={t('sidebar.label')}
      data-testid={TEST_IDS.shell.sidebar}
      className="flex flex-col gap-6"
    >
      <SidebarSection title={t('sidebar.browse')}>
        <SidebarLink href={routes.library} icon={LayoutGrid} active={onLibrary && !category}>
          {t('sidebar.allTools')}
        </SidebarLink>
        {categories.map((item) => (
          <SidebarLink
            key={item.id}
            href={routes.libraryWith({ category: item.id })}
            icon={categoryIcon(item.icon)}
            active={onLibrary && category === item.id}
            data-testid={TEST_IDS.shell.sidebarCategory}
            data-id={item.id}
          >
            {pickLocalized(item.name, locale)}
          </SidebarLink>
        ))}
      </SidebarSection>
      {status === 'signedIn' && (
        <SidebarSection title={t('sidebar.myLibrary')}>
          <SidebarLink
            href={routes.myLibrary}
            icon={Heart}
            active={pathname === routes.myLibrary && !collection}
          >
            {t('sidebar.saved')}
          </SidebarLink>
          <SidebarCollections />
        </SidebarSection>
      )}
      <SidebarSection title={t('sidebar.discover')}>
        <SidebarLink
          href={routes.bundles}
          icon={Package}
          active={pathname.startsWith(routes.bundles)}
        >
          {t('sidebar.bundles')}
        </SidebarLink>
        <SidebarLink href={routes.compare()} icon={Columns2} active={pathname === routes.compare()}>
          {t('sidebar.compare')}
        </SidebarLink>
      </SidebarSection>
    </nav>
  );
}
