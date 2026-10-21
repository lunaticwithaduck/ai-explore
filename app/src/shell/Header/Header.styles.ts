export const headerStyles = {
  root: 'sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-border border-b bg-surface px-3 sm:px-4 lg:gap-6 lg:px-6',
  start: 'flex shrink-0 items-center gap-1.5 lg:w-52',
  search: 'hidden min-w-0 max-w-xl flex-1 md:block',
  searchInput: '',
  end: 'ml-auto flex items-center gap-1 sm:gap-3',
  locale: 'hidden lg:block',
  localeTrigger:
    'w-auto gap-1.5 border-transparent bg-transparent text-text hover:bg-surface-overlay',
} as const;
