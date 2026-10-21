export const bundleHeaderStyles = {
  root: 'flex flex-col',
  banner: 'relative h-40 bg-linear-to-br sm:h-64',
  fade: 'absolute inset-0 bg-linear-to-t from-surface via-surface/50 to-transparent',
  back: 'absolute top-4 left-4 ml-0 bg-black/50 px-4 text-base text-white backdrop-blur-sm hover:bg-black/70 hover:text-white sm:top-6 sm:left-6',
  tile: [
    'absolute bottom-0 left-1/2 flex size-24 -translate-x-1/2 translate-y-1/2 items-center justify-center',
    'rounded-xl border-4 border-surface bg-linear-to-br text-white shadow-overlay sm:size-32',
  ].join(' '),
  icon: 'size-12 sm:size-16',
  intro: 'mx-auto flex max-w-2xl flex-col items-center gap-3 px-4 pt-16 text-center sm:pt-20',
} as const;
