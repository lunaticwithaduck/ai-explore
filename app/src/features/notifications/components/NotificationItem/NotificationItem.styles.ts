export const itemStyles = {
  root: 'border-border border-b last:border-b-0',
  link: 'flex gap-3 px-4 py-3 transition-colors duration-fast hover:bg-surface-raised focus-visible:bg-surface-raised',
  unread: 'bg-accent-subtle',
  body: 'flex min-w-0 flex-1 flex-col gap-1',
  head: 'flex items-center justify-between gap-2',
  meta: 'flex flex-wrap items-center gap-2',
} as const;
