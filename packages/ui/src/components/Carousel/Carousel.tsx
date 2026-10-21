'use client';

import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  type ButtonHTMLAttributes,
  Children,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  useEffect,
  useState,
} from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from '../IconButton/IconButton';
import {
  carouselHeaderStyles,
  carouselSlideStyles,
  carouselStyles,
  carouselTrackStyles,
  carouselViewportStyles,
} from './Carousel.styles';

export type CarouselButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onClick' | 'disabled' | 'aria-label' | 'children'
> & { [key: `data-${string}`]: string | undefined };

export type CarouselProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children: ReactNode;
  previousLabel: string;
  nextLabel: string;
  previousButtonProps?: CarouselButtonProps | undefined;
  nextButtonProps?: CarouselButtonProps | undefined;
  heading?: ReactNode;
  slideSize?: 'sm' | 'md' | 'lg' | 'full' | undefined;
};

export const Carousel = forwardRef<HTMLElement, CarouselProps>(
  (
    {
      children,
      previousLabel,
      nextLabel,
      previousButtonProps,
      nextButtonProps,
      heading,
      slideSize,
      className,
      ...props
    },
    ref,
  ) => {
    const [viewportRef, api] = useEmblaCarousel({
      align: 'start',
      containScroll: 'trimSnaps',
      slidesToScroll: 'auto',
    });
    const [canPrevious, setCanPrevious] = useState(false);
    const [canNext, setCanNext] = useState(false);

    useEffect(() => {
      if (!api) return;
      const update = () => {
        setCanPrevious(api.canScrollPrev());
        setCanNext(api.canScrollNext());
      };
      update();
      api.on('select', update).on('reInit', update);
      return () => {
        api.off('select', update).off('reInit', update);
      };
    }, [api]);

    return (
      <section ref={ref} className={cn(carouselStyles(), className)} {...props}>
        <div className={carouselHeaderStyles()}>
          <div className="min-w-0 flex-1">{heading}</div>
          <div className={cn('flex shrink-0 gap-2', !canPrevious && !canNext && 'hidden')}>
            <IconButton
              {...previousButtonProps}
              icon={ChevronLeft}
              label={previousLabel}
              variant="secondary"
              size="sm"
              shape="circle"
              disabled={!canPrevious}
              onClick={() => api?.scrollPrev()}
            />
            <IconButton
              {...nextButtonProps}
              icon={ChevronRight}
              label={nextLabel}
              variant="secondary"
              size="sm"
              shape="circle"
              disabled={!canNext}
              onClick={() => api?.scrollNext()}
            />
          </div>
        </div>
        <div ref={viewportRef} className={carouselViewportStyles()}>
          <div className={carouselTrackStyles()}>
            {Children.map(children, (child) =>
              child === null || child === undefined || typeof child === 'boolean' ? null : (
                <div className={carouselSlideStyles({ slideSize })}>{child}</div>
              ),
            )}
          </div>
        </div>
      </section>
    );
  },
);

Carousel.displayName = 'Carousel';
