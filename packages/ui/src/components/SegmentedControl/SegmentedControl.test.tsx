import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { SegmentedControl } from './SegmentedControl';

const OPTIONS = [
  { value: 'monthly', label: 'Monthly', testId: 'period' },
  { value: 'yearly', label: 'Yearly', testId: 'period' },
];

function Harness() {
  const [value, setValue] = useState('monthly');
  return (
    <SegmentedControl label="Period" options={OPTIONS} value={value} onValueChange={setValue} />
  );
}

describe('SegmentedControl', () => {
  it('exposes radios with aria-checked, data-id and test ids', async () => {
    render(<Harness />);
    const yearly = screen.getByRole('radio', { name: 'Yearly' });
    expect(yearly).toHaveAttribute('data-id', 'yearly');
    expect(yearly).toHaveAttribute('data-testid', 'period');
    expect(yearly).toHaveAttribute('aria-checked', 'false');
    await userEvent.click(yearly);
    expect(yearly).toHaveAttribute('aria-checked', 'true');
    await userEvent.click(yearly);
    expect(yearly).toHaveAttribute('aria-checked', 'true');
  });
});
