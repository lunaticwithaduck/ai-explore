export const toolHeroStyles = {
  root: 'relative h-56 w-full shrink-0 overflow-hidden sm:h-80',
  logo: 'absolute inset-0 flex size-full rounded-none px-8 pt-10 pb-20 ring-0 *:opacity-90 sm:p-16',
  shade: 'absolute inset-0 bg-linear-135 from-transparent to-black/15',
  fade: 'absolute inset-0 bg-linear-to-t from-surface via-surface/30 to-transparent',
  back: 'absolute top-4 left-4 z-10 sm:top-6 sm:left-6',
} as const;
