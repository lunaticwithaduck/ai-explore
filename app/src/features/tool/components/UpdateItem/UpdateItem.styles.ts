export const updateItemStyles = {
  root: 'rounded-button border border-border p-5 transition-colors duration-base hover:border-accent/50',
  labels: 'mb-2 flex flex-wrap items-center gap-2',
  kind: 'flex items-center gap-1 rounded-xs px-2 py-1 font-medium text-xs',
  kindIcon: 'size-3 shrink-0',
  title: 'mb-1',
  date: 'flex items-center gap-1',
  dateIcon: 'size-3.5 shrink-0',
  changes: 'mt-3 flex flex-col gap-2',
  bullet: 'mt-2 size-1 shrink-0 rounded-full',
  tone: {
    feature: { badge: 'bg-blue-500/20 text-blue-400', bullet: 'bg-blue-400' },
    improvement: { badge: 'bg-green-500/20 text-green-400', bullet: 'bg-green-400' },
    bugfix: { badge: 'bg-red-500/20 text-red-400', bullet: 'bg-red-400' },
  },
} as const;
