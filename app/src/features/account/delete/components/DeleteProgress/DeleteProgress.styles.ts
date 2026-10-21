export const deleteProgressStyles = {
  root: 'flex flex-col gap-4',
  list: 'flex flex-col gap-3 rounded-lg border border-border bg-surface p-4',
  item: 'flex items-center gap-3',
  icon: 'size-4 shrink-0',
  done: 'text-success',
  active: 'animate-spin text-accent',
  pending: 'text-text-subtle',
} as const;
