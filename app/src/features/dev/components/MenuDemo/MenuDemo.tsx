'use client';

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@ai-explore/ui';
import { Bookmark, ChevronDown, LogOut, Settings, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { routes } from '@/config/routes';
import { Link } from '@/i18n/navigation';

export function MenuDemo() {
  const t = useTranslations('dev');
  const [inCollection, setInCollection] = useState(true);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" iconRight={ChevronDown}>
          {t('overlays.menu')}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{t('overlays.menuAccount')}</DropdownMenuLabel>
        <DropdownMenuItem icon={User} asChild>
          <Link href={routes.profile}>{t('overlays.menuProfile')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem icon={Settings}>{t('overlays.menuSettings')}</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('overlays.menuCollections')}</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          icon={Bookmark}
          iconClassName="text-accent-violet"
          checked={inCollection}
          onCheckedChange={setInCollection}
          onSelect={(event) => event.preventDefault()}
        >
          {t('overlays.menuCollection')}
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={LogOut} tone="danger">
          {t('overlays.menuSignOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
