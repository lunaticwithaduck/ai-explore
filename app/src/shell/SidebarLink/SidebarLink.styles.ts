export const sidebarLinkStyles = {
  base: 'h-12 justify-start gap-3 px-4 text-base text-text [&_svg]:size-5',
  active: 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground',
  label: 'truncate',
  count: 'ml-auto rounded-xs bg-surface-overlay/50 px-2 py-1 text-xs tabular-nums',
} as const;
