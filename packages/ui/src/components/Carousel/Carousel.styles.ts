import { cva } from 'class-variance-authority';

export const carouselStyles = cva('flex min-w-0 flex-col gap-3');

export const carouselHeaderStyles = cva('flex items-center justify-between gap-3');

export const carouselViewportStyles = cva('overflow-hidden');

export const carouselTrackStyles = cva('-ml-4 flex touch-pan-y touch-pinch-zoom');

export const carouselSlideStyles = cva('min-w-0 shrink-0 grow-0 pl-4', {
  variants: {
    slideSize: {
      sm: 'basis-1/2 sm:basis-1/3 lg:basis-1/4',
      md: 'basis-4/5 sm:basis-1/2 lg:basis-1/3',
      lg: 'basis-full sm:basis-2/3 lg:basis-1/2',
      full: 'basis-full',
    },
  },
  defaultVariants: { slideSize: 'md' },
});
