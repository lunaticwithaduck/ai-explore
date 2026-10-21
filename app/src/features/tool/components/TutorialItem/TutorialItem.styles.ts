export const tutorialItemStyles = {
  root: 'flex h-full flex-col overflow-hidden rounded-button transition-colors duration-base hover:border-accent/50',
  media: 'relative aspect-video w-full bg-black',
  frame: 'absolute inset-0 size-full border-0',
  play: 'group absolute inset-0 size-full rounded-none border-0 p-0',
  playIcon:
    'absolute flex size-12 items-center justify-center rounded-full bg-black/70 text-white transition-transform duration-fast group-hover:scale-110',
  body: 'flex flex-1 flex-col gap-3 p-4',
  meta: 'mt-auto flex flex-wrap items-center gap-3',
  metaItem: 'flex items-center gap-1',
  metaIcon: 'size-3 shrink-0 text-text-muted',
} as const;
