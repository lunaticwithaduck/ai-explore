export const itemStyles = {
  root: 'border-border border-b last:border-b-0',
  link: 'flex gap-3 px-4 py-3 transition-colors duration-fast hover:bg-surface-overlay/50 focus-visible:bg-surface-overlay/50',
  unread: 'bg-accent-subtle',
  body: 'flex min-w-0 flex-1 flex-col gap-1',
  head: 'flex items-center justify-between gap-2',
  meta: 'flex flex-wrap items-center gap-2',
} as const;
