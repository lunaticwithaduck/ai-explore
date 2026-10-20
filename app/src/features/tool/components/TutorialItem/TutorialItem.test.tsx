import type { Tutorial } from '@ai-explore/schemas';
import { fireEvent, render, screen } from '@testing-library/react';
import { NextIntlClientProvider } from 'next-intl';
import { describe, expect, it } from 'vitest';
import tool from '@/messages/en/tool.json';
import { TutorialItem } from './TutorialItem';

const tutorial: Tutorial = {
  youtubeId: 'dQw4w9WgXcQ',
  title: { en: 'Getting started' },
  durationMin: 12,
  difficulty: 'beginner',
};

describe('TutorialItem click-to-load', () => {
  it('shows the thumbnail first and loads the nocookie embed on click', () => {
    const { container } = render(
      <NextIntlClientProvider locale="en" messages={{ tool }}>
        <TutorialItem tutorial={tutorial} />
      </NextIntlClientProvider>,
    );
    expect(container.querySelector('iframe')).toBeNull();
    const thumb = screen.getByRole('img', { name: 'Getting started' });
    expect(thumb).toHaveAttribute('src', 'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');

    fireEvent.click(screen.getByRole('button', { name: /Play tutorial/ }));

    const frame = container.querySelector('iframe');
    expect(frame).toHaveAttribute(
      'src',
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1',
    );
    expect(screen.queryByRole('img', { name: 'Getting started' })).toBeNull();
  });
});
