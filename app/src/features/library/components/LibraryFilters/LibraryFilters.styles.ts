export const libraryFiltersStyles = {
  root: 'flex flex-col gap-4',
  searchRow: 'flex gap-3',
  toggle: 'px-4',
  toggleLabel: 'sr-only md:not-sr-only',
  count:
    'flex size-5 items-center justify-center rounded-full bg-accent-foreground text-accent tabular-nums',
  categories:
    '-mx-4 flex-nowrap overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 lg:hidden',
} as const;
