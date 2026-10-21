export const toolCardStyles = {
  card: 'flex h-full flex-col overflow-hidden',
  header: 'relative h-40 shrink-0',
  logo: 'absolute inset-0 size-full rounded-none bg-linear-135 from-transparent to-black/15 p-11 ring-0',
  rating:
    'absolute top-3 right-3 flex items-center gap-1 rounded-full bg-black/70 px-3 py-1 text-sm text-white backdrop-blur-sm',
  ratingStar: 'size-3.5 fill-yellow-400 text-yellow-400',
  free: 'absolute top-3 left-3 flex items-center gap-1 rounded-full bg-green-700 px-2 py-1 text-white text-xs backdrop-blur-sm',
  freeIcon: 'size-3',
  body: 'flex flex-1 flex-col p-5',
  titleRow: 'mb-2 flex items-start justify-between gap-2',
  actions: 'relative z-10 -my-1.5 -mr-2 shrink-0',
  bottomRow: 'mt-auto flex flex-nowrap items-center justify-between gap-x-2',
} as const;
