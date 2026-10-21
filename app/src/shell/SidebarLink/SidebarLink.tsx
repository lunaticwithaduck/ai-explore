import { Button, cn } from '@ai-explore/ui';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { sidebarLinkStyles } from './SidebarLink.styles';

export type SidebarLinkProps = {
  href: string;
  icon: LucideIcon;
  active?: boolean;
  count?: number | undefined;
  children: ReactNode;
  'data-testid'?: string;
  'data-id'?: string;
};

export function SidebarLink({
  href,
  icon,
  active = false,
  count,
  children,
  ...dataProps
}: SidebarLinkProps) {
  return (
    <Button
      asChild
      variant="ghost"
      fullWidth
      iconLeft={icon}
      className={cn(sidebarLinkStyles.base, active && sidebarLinkStyles.active)}
    >
      <Link href={href} aria-current={active ? 'page' : undefined} {...dataProps}>
        <span className={sidebarLinkStyles.label}>{children}</span>
        {count !== undefined && <span className={sidebarLinkStyles.count}>{count}</span>}
      </Link>
    </Button>
  );
}
