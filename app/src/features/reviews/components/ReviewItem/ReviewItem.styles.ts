export const reviewItemStyles = {
  root: 'flex flex-col gap-3',
  header: 'flex items-start gap-3',
  meta: 'flex min-w-0 flex-1 flex-col gap-1',
  nameRow: 'flex flex-wrap items-center gap-2',
  name: 'truncate',
  detailRow: 'flex flex-wrap items-center gap-x-2 gap-y-1',
  separator: 'size-1 rounded-full bg-text-subtle',
  body: 'whitespace-pre-line break-words',
  footer: 'flex flex-wrap items-center gap-2',
} as const;
