import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { SearchInput } from './SearchInput';

function Harness({ onValue }: { onValue: (value: string) => void }) {
  const [value, setValue] = useState('mid');
  return (
    <SearchInput
      value={value}
      placeholder="Search tools"
      clearLabel="Clear search"
      onClear={() => setValue('')}
      onChange={(event) => {
        setValue(event.target.value);
        onValue(event.target.value);
      }}
    />
  );
}

describe('SearchInput', () => {
  it('forwards its value and change events to the input', async () => {
    const onValue = vi.fn();
    render(<Harness onValue={onValue} />);
    const input = screen.getByRole('searchbox');
    expect(input).toHaveValue('mid');
    await userEvent.type(input, 'j');
    expect(input).toHaveValue('midj');
    expect(onValue).toHaveBeenLastCalledWith('midj');
  });

  it('clears through the clear button', async () => {
    render(<Harness onValue={() => {}} />);
    await userEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(screen.getByRole('searchbox')).toHaveValue('');
    expect(screen.queryByRole('button', { name: 'Clear search' })).toBeNull();
  });

  it('forwards the ref', () => {
    const ref = createRef<HTMLInputElement>();
    render(<SearchInput ref={ref} defaultValue="abc" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.value).toBe('abc');
  });
});
