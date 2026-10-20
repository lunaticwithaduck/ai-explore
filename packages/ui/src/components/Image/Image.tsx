import type { VariantProps } from 'class-variance-authority';
import { forwardRef, type ImgHTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { imageStyles } from './Image.styles';

export type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'alt'> &
  VariantProps<typeof imageStyles> & {
    alt: string;
    className?: string | undefined;
  };

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ alt, fit, radius, loading = 'lazy', decoding = 'async', className, ...props }, ref) => (
    <img
      ref={ref}
      alt={alt}
      loading={loading}
      decoding={decoding}
      className={cn(imageStyles({ fit, radius }), className)}
      {...props}
    />
  ),
);

Image.displayName = 'Image';
