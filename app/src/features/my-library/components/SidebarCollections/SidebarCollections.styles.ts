export const sidebarCollectionStyles = {
  base: 'h-12 justify-start gap-3 px-4 text-base text-text',
  active: 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground',
  icon: 'size-5 shrink-0',
  label: 'truncate',
  count: 'ml-auto rounded-xs bg-surface-overlay/50 px-2 py-1 text-xs tabular-nums',
} as const;
