import { Card, Carousel, Heading, StarRating, Text, ToolLogo } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { CAROUSEL_SLIDES, SAMPLE_LOGOS } from '../../config/constants';
import { DemoSection } from '../DemoSection/DemoSection';

export function CarouselSection() {
  const t = useTranslations('dev');
  return (
    <DemoSection
      id="carousel"
      title={t('carousel.title')}
      description={t('carousel.description')}
      wide
    >
      <Carousel
        aria-label={t('carousel.label')}
        previousLabel={t('carousel.previous')}
        nextLabel={t('carousel.next')}
        slideSize="sm"
        heading={
          <Heading level={3} size="md">
            {t('carousel.heading')}
          </Heading>
        }
      >
        {CAROUSEL_SLIDES.map((index) => {
          const logo = SAMPLE_LOGOS[index % SAMPLE_LOGOS.length] ?? SAMPLE_LOGOS[0];
          const rating = 5 - (index % 4) * 0.5;
          return (
            <Card
              key={index}
              variant="interactive"
              padding="sm"
              className="flex h-full flex-col gap-3"
            >
              <ToolLogo src={logo.src} alt={t('media.logoAlt')} background={logo.background} />
              <div className="flex flex-1 flex-col gap-1">
                <Heading level={4} size="sm">
                  {t('carousel.slide', { index })}
                </Heading>
                <Text size="xs" tone="muted" clamp={2}>
                  {t('carousel.slideBody')}
                </Text>
              </div>
              <StarRating
                value={rating}
                size="sm"
                label={t('ratings.starsLabel', { value: rating })}
                valueText={t('ratings.value', { value: rating })}
              />
            </Card>
          );
        })}
      </Carousel>
    </DemoSection>
  );
}
