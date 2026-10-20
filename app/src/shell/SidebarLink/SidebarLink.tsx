import { Button, cn } from '@ai-explore/ui';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';
import { sidebarLinkStyles } from './SidebarLink.styles';

export type SidebarLinkProps = {
  href: string;
  icon: LucideIcon;
  active?: boolean;
  children: ReactNode;
  'data-testid'?: string;
  'data-id'?: string;
};

export function SidebarLink({
  href,
  icon,
  active = false,
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
        <span className="truncate">{children}</span>
      </Link>
    </Button>
  );
}
