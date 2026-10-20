import { render, screen } from '@testing-library/react';
import { ToolLogo } from './ToolLogo';

describe('ToolLogo', () => {
  it('sets --logo-bg from the background prop', () => {
    render(
      <ToolLogo
        src="/logos/square.svg"
        alt="Square"
        background="rgb(16 163 127)"
        data-testid="logo"
      />,
    );
    expect(screen.getByTestId('logo').style.getPropertyValue('--logo-bg')).toBe('rgb(16 163 127)');
  });

  it('keeps an identical box whatever the image aspect ratio', () => {
    render(
      <>
        <ToolLogo
          src="/logos/square.svg"
          alt="Square"
          background="black"
          size="lg"
          data-testid="a"
        />
        <ToolLogo src="/logos/wide.png" alt="Wide" background="white" size="lg" data-testid="b" />
      </>,
    );
    const a = screen.getByTestId('a');
    const b = screen.getByTestId('b');
    expect(a.className).toBe(b.className);
    expect(a).toHaveClass('size-20', 'shrink-0', 'overflow-hidden');
    for (const name of ['Square', 'Wide']) {
      const img = screen.getByRole('img', { name });
      expect(img).toHaveClass('size-full', 'object-contain');
      expect(img).toHaveAttribute('loading', 'lazy');
    }
  });

  it('uses a different fixed box per size', () => {
    render(<ToolLogo src="/logos/a.svg" alt="A" background="black" size="sm" data-testid="sm" />);
    expect(screen.getByTestId('sm')).toHaveClass('size-8');
  });
});
