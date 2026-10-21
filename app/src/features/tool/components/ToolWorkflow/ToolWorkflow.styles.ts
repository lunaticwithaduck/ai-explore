export const toolWorkflowStyles = {
  scroller: 'mb-6 overflow-x-auto pb-2',
  list: 'flex min-w-max items-start gap-3 pt-1 pl-1',
  step: 'flex items-start gap-3',
  connector: 'flex flex-col items-center gap-1 pt-6 text-text-muted',
  arrow: 'size-5',
  tile: 'flex w-24 flex-col items-center gap-2 rounded-card text-center',
  link: 'outline-hidden transition-transform duration-base hover:scale-105 focus-visible:ring-3 focus-visible:ring-focus-ring',
  current: 'ring-2 ring-accent ring-offset-2 ring-offset-surface',
} as const;
