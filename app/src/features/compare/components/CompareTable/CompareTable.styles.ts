export const tableStyles = {
  scroller: 'w-full overflow-x-auto rounded-card border border-border bg-surface-raised',
  table: 'w-full min-w-96 border-separate border-spacing-0 text-left',
  corner: 'sticky left-0 z-10 border-b border-border w-24 bg-surface-raised p-3 sm:w-48 sm:p-4',
  column: 'min-w-36 border-b border-border p-3 align-top sm:p-4',
  columnHead: 'flex flex-col items-start gap-2',
  rowLabel:
    'sticky left-0 z-10 w-24 border-b border-border bg-surface-raised p-3 align-top text-xs font-medium uppercase tracking-wide text-text-subtle sm:w-48 sm:p-4',
  cell: 'border-b border-border p-3 align-top text-sm text-text sm:p-4',
  features: 'flex list-disc flex-col gap-1 pl-4 marker:text-text-subtle',
  yesNo: 'inline-flex items-center gap-1.5',
  yes: 'size-4 text-success',
  no: 'size-4 text-text-subtle',
} as const;
