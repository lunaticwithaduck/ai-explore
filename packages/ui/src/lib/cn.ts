import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      radius: ['button', 'card'],
      shadow: ['card', 'card-hover', 'overlay'],
      ease: ['standard', 'emphasized'],
      container: ['content', 'prose'],
      animate: [
        'fade-in',
        'fade-out',
        'pop-in',
        'pop-out',
        'slide-in-left',
        'slide-out-left',
        'slide-in-right',
        'slide-out-right',
      ],
    },
    classGroups: {
      duration: [{ duration: ['fast', 'base', 'slow'] }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
