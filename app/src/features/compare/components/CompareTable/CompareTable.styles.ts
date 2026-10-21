export const tableStyles = {
  scroller: 'w-full rounded-card border border-border bg-surface-raised sm:overflow-x-auto',
  table: 'block w-full border-separate border-spacing-0 text-left sm:table sm:min-w-96',
  head: 'block sm:table-header-group',
  headRow:
    'sticky top-16 z-30 grid grid-cols-2 rounded-t-card bg-surface-raised sm:static sm:table-row',
  body: 'block sm:table-row-group',
  bodyRow: 'grid grid-cols-2 sm:table-row',
  corner:
    'hidden border-b border-border bg-surface-raised p-4 sm:sticky sm:left-0 sm:z-10 sm:table-cell sm:w-48',
  column: 'block min-w-0 border-b border-border p-3 align-top sm:table-cell sm:min-w-36 sm:p-4',
  columnHead: 'flex flex-col items-start gap-2',
  rowLabel:
    'col-span-2 block bg-surface-sunken px-3 pt-3 pb-1 text-xs font-medium uppercase tracking-wide text-text-subtle sm:sticky sm:left-0 sm:z-10 sm:table-cell sm:w-48 sm:border-b sm:border-border sm:bg-surface-raised sm:p-4 sm:align-top',
  cell: 'block min-w-0 border-b border-border p-3 align-top text-sm text-text sm:table-cell sm:p-4',
  features: 'flex list-disc flex-col gap-1 pl-4 marker:text-text-subtle',
  yesNo: 'inline-flex items-center gap-1.5',
  yes: 'size-4 text-success',
  no: 'size-4 text-text-subtle',
} as const;
