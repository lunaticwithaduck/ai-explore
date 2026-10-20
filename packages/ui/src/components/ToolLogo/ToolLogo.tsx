import type { VariantProps } from 'class-variance-authority';
import { type CSSProperties, forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/cn';
import { Image } from '../Image/Image';
import { toolLogoStyles } from './ToolLogo.styles';

export type ToolLogoProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children' | 'style'> &
  VariantProps<typeof toolLogoStyles> & {
    src: string;
    alt: string;
    background: string;
    className?: string | undefined;
  };

export const ToolLogo = forwardRef<HTMLSpanElement, ToolLogoProps>(
  ({ src, alt, background, size, shape, className, ...props }, ref) => (
    <span
      ref={ref}
      style={{ '--logo-bg': background } as CSSProperties}
      className={cn(toolLogoStyles({ size, shape }), className)}
      {...props}
    >
      <Image src={src} alt={alt} fit="contain" className="size-full" />
    </span>
  ),
);

ToolLogo.displayName = 'ToolLogo';
