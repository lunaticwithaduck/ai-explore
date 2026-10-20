import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { RatingInput, type RatingValue } from './RatingInput';

function Harness({ initial = null }: { initial?: number | null }) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <RatingInput
      value={value}
      onChange={(next: RatingValue) => setValue(next)}
      label="Your rating"
      getOptionLabel={(n) => `${n} of 5`}
      data-testid="rating"
    />
  );
}

const checked = () =>
  screen
    .getAllByRole('radio')
    .filter((radio) => radio.getAttribute('aria-checked') === 'true')
    .map((radio) => radio.getAttribute('data-id'));

describe('RatingInput', () => {
  it('renders a radiogroup of five radios with data ids', () => {
    render(<Harness />);
    expect(screen.getByRole('radiogroup', { name: 'Your rating' })).toBeInTheDocument();
    const radios = screen.getAllByRole('radio');
    expect(radios.map((radio) => radio.getAttribute('data-id'))).toEqual(['1', '2', '3', '4', '5']);
    expect(radios.every((radio) => radio.getAttribute('aria-checked') === 'false')).toBe(true);
  });

  it('checks the clicked option', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('radio', { name: '4 of 5' }));
    expect(checked()).toEqual(['4']);
  });

  it('moves the selection with arrow keys, Home and End', async () => {
    const user = userEvent.setup();
    render(<Harness initial={3} />);
    await user.tab();
    expect(screen.getByRole('radio', { name: '3 of 5' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(checked()).toEqual(['4']);
    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(checked()).toEqual(['2']);
    await user.keyboard('{End}');
    expect(checked()).toEqual(['5']);
    await user.keyboard('{ArrowRight}');
    expect(checked()).toEqual(['5']);
    await user.keyboard('{Home}');
    expect(checked()).toEqual(['1']);
  });
});
