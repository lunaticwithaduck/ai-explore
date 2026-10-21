import { Card, Carousel, Heading } from '@ai-explore/ui';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { TEST_IDS } from '@/config/test-ids';
import { toolCarouselSectionStyles as styles } from './ToolCarouselSection.styles';

export type ToolCarouselSectionProps = {
  title: string;
  icon?: LucideIcon | undefined;
  previousLabel: string;
  nextLabel: string;
  buttons: keyof typeof styles.button;
  testId: string;
  children: ReactNode;
};

export function ToolCarouselSection({
  title,
  icon: Icon,
  previousLabel,
  nextLabel,
  buttons,
  testId,
  children,
}: ToolCarouselSectionProps) {
  const buttonClass = styles.button[buttons];
  return (
    <Card padding="none" className={styles.card}>
      <Carousel
        data-testid={testId}
        className={styles.carousel}
        heading={
          <div className={styles.titleRow}>
            {Icon && <Icon aria-hidden className={styles.icon} />}
            <Heading level={2}>{title}</Heading>
          </div>
        }
        previousLabel={previousLabel}
        nextLabel={nextLabel}
        previousButtonProps={{ 'data-testid': TEST_IDS.carousel.previous, className: buttonClass }}
        nextButtonProps={{ 'data-testid': TEST_IDS.carousel.next, className: buttonClass }}
        slideSize="sm"
      >
        {children}
      </Carousel>
    </Card>
  );
}
