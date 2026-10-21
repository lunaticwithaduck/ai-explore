export const accountPageStyles = {
  main: 'flex w-full min-w-0 flex-1 flex-col bg-surface',
  banner: 'relative h-32 sm:h-48',
  gradient: {
    profile: 'bg-linear-to-r from-purple-600 via-pink-600 to-blue-600',
    settings: 'bg-linear-to-r from-blue-600 via-purple-600 to-pink-600',
  },
  fade: 'absolute inset-0 bg-linear-to-t from-surface via-surface/50 to-transparent',
  back: 'absolute top-4 left-4 z-10 sm:top-6 sm:left-6',
  body: 'relative z-10 mx-auto -mt-16 flex w-full flex-col gap-6 px-4 pb-8 sm:px-8',
  width: {
    wide: 'max-w-6xl sm:-mt-24 sm:gap-8',
    narrow: 'max-w-4xl sm:-mt-20',
  },
} as const;
