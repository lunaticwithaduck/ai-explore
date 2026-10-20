'use client';

import {
  Avatar,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Text,
} from '@ai-explore/ui';
import { ChevronDown, LogOut, Settings, ShieldCheck, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { routes } from '@/config/routes';
import { TEST_IDS } from '@/config/test-ids';
import { useCurrentProfile } from '@/features/auth/hooks/useCurrentProfile';
import { useCurrentUser } from '@/features/auth/hooks/useCurrentUser';
import { useIsAdmin } from '@/features/auth/hooks/useIsAdmin';
import { useSignOut } from '@/features/auth/hooks/useSignOut';
import { initials } from '@/features/auth/utils/initials';
import { Link } from '@/i18n/navigation';
import { userMenuStyles } from './UserMenu.styles';

export function UserMenu() {
  const t = useTranslations('shell');
  const { user } = useCurrentUser();
  const { profile } = useCurrentProfile();
  const { isAdmin } = useIsAdmin();
  const signOut = useSignOut();
  const name = profile?.displayName ?? user?.displayName ?? user?.email ?? '';
  const photo = profile?.photoUrl ?? user?.photoUrl ?? null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={userMenuStyles.trigger}
          data-testid={TEST_IDS.shell.userMenu}
        >
          <Avatar
            size="sm"
            src={photo}
            alt={t('account.menuLabel', { name })}
            fallback={initials(name)}
          />
          <Text as="span" aria-hidden size="sm" weight="medium" className={userMenuStyles.name}>
            {name}
          </Text>
          <ChevronDown aria-hidden className={userMenuStyles.chevron} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={userMenuStyles.content}>
        <div className={userMenuStyles.identity}>
          <Avatar size="md" src={photo} alt={name} fallback={initials(name)} />
          <div className={userMenuStyles.identityText}>
            <Text size="sm" weight="medium" clamp={1}>
              {name}
            </Text>
            {user?.email && (
              <Text size="xs" tone="muted" clamp={1}>
                {user.email}
              </Text>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem icon={User} asChild>
          <Link href={routes.profile}>{t('account.profile')}</Link>
        </DropdownMenuItem>
        <DropdownMenuItem icon={Settings} asChild>
          <Link href={routes.settings}>{t('account.settings')}</Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem icon={ShieldCheck} asChild>
            <Link href={routes.admin}>{t('account.admin')}</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          icon={LogOut}
          tone="danger"
          onSelect={() => void signOut()}
          data-testid={TEST_IDS.shell.signOut}
        >
          {t('account.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
