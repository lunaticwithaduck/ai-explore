import { render, screen } from '@testing-library/react';
import { Carousel } from './Carousel';

describe('Carousel', () => {
  it('disables previous at the start and passes props through to its buttons', () => {
    render(
      <Carousel
        previousLabel="Previous"
        nextLabel="Next"
        previousButtonProps={{ 'data-testid': 'carousel-previous' }}
        nextButtonProps={{ 'data-testid': 'carousel-next' }}
      >
        <span>One</span>
        <span>Two</span>
        <span>Three</span>
      </Carousel>,
    );
    const previous = screen.getByRole('button', { name: 'Previous' });
    expect(previous).toBeDisabled();
    expect(previous).toHaveAttribute('data-testid', 'carousel-previous');
    expect(screen.getByRole('button', { name: 'Next' })).toHaveAttribute(
      'data-testid',
      'carousel-next',
    );
    expect(screen.getByText('Three')).toBeInTheDocument();
  });
});
