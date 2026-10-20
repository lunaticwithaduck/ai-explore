import { render, screen } from '@testing-library/react';
import { StarRating } from './StarRating';

describe('StarRating', () => {
  it('labels the rating and renders a half star', () => {
    const { container } = render(<StarRating value={3.4} label="3.5 out of 5" valueText="3.4" />);
    expect(screen.getByRole('img', { name: '3.5 out of 5' })).toBeInTheDocument();
    expect(container.querySelectorAll('svg.fill-star')).toHaveLength(4);
    expect(container.querySelectorAll('.w-1\\/2')).toHaveLength(1);
  });

  it('clamps out-of-range values', () => {
    const { container } = render(<StarRating value={9} label="5 out of 5" />);
    expect(container.querySelectorAll('svg.fill-star')).toHaveLength(5);
  });
});
