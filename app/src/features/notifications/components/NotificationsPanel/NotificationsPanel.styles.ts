export const panelStyles = {
  content: 'flex max-h-(--radix-popover-content-available-height) flex-col p-0',
  header: 'flex items-center justify-between gap-3 border-border border-b px-4 py-3',
  list: 'min-h-0 flex-1 overflow-y-auto',
  empty: 'flex flex-col items-center gap-2 px-4 py-10 text-center',
  emptyIcon: 'size-8 text-text-subtle',
  status: 'px-4 py-6 text-center',
} as const;
