export const shellFrameStyles = {
  root: 'flex min-h-dvh flex-col',
  body: 'flex flex-1',
  sidebarColumn: 'hidden w-72 shrink-0 border-border border-r bg-surface-sunken lg:block',
  sidebar: 'sticky top-0 -mt-16 flex h-dvh flex-col pt-16',
  sidebarScroll: 'flex-1 overflow-y-auto px-3 py-5',
  content: 'flex min-w-0 flex-1 flex-col',
} as const;
