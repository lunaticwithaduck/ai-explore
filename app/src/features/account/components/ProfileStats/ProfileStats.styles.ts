export const profileStatsStyles = {
  list: 'grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4',
  tile: 'flex min-w-0 flex-col gap-2 rounded-button border border-border bg-surface-overlay/50 p-3 sm:p-4',
  term: 'flex min-w-0 items-center gap-2 text-sm text-text-muted sm:gap-3',
  icon: 'size-5 shrink-0',
  label: 'min-w-0 leading-tight',
  value: 'text-xl tabular-nums text-text sm:text-2xl',
  loading: 'h-8 w-16',
  tone: {
    saved: 'text-red-400',
    collections: 'text-blue-400',
    memberSince: 'text-green-400',
    reviews: 'text-purple-400',
  },
} as const;
