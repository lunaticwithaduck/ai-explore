import { Badge, Heading, Text, TextLink } from '@ai-explore/ui';
import { useTranslations } from 'next-intl';
import { ButtonsSection } from '../components/ButtonsSection/ButtonsSection';
import { CarouselSection } from '../components/CarouselSection/CarouselSection';
import { ColorsSection } from '../components/ColorsSection/ColorsSection';
import { FeedbackSection } from '../components/FeedbackSection/FeedbackSection';
import { FormsSection } from '../components/FormsSection/FormsSection';
import { MediaSection } from '../components/MediaSection/MediaSection';
import { NavigationSection } from '../components/NavigationSection/NavigationSection';
import { OverlaysSection } from '../components/OverlaysSection/OverlaysSection';
import { RatingsSection } from '../components/RatingsSection/RatingsSection';
import { SurfacesSection } from '../components/SurfacesSection/SurfacesSection';
import { TypographySection } from '../components/TypographySection/TypographySection';
import { SECTION_IDS } from '../config/constants';

export function PrimitivesView() {
  const t = useTranslations('dev');
  return (
    <main className="mx-auto flex w-full max-w-content flex-col gap-8 px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-col gap-4">
        <Badge tone="accent" className="self-start">
          {t('eyebrow')}
        </Badge>
        <div className="flex flex-col gap-2">
          <Heading level={1}>{t('title')}</Heading>
          <Text tone="muted" className="max-w-prose">
            {t('intro')}
          </Text>
        </div>
        <nav aria-label={t('contents')} className="flex flex-wrap gap-x-4 gap-y-2">
          {SECTION_IDS.map((id) => (
            <TextLink key={id} href={`#${id}`} tone="muted" size="sm">
              {t(`${id}.title`)}
            </TextLink>
          ))}
        </nav>
      </header>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ColorsSection />
        <TypographySection />
        <ButtonsSection />
        <FormsSection />
        <SurfacesSection />
        <FeedbackSection />
        <OverlaysSection />
        <NavigationSection />
        <RatingsSection />
        <CarouselSection />
        <MediaSection />
      </div>
    </main>
  );
}
