import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Tag } from './Tag';

function Harness() {
  const [pressed, setPressed] = useState(false);
  return (
    <Tag pressed={pressed} onPressedChange={setPressed} data-id="image">
      Image
    </Tag>
  );
}

describe('Tag', () => {
  it('toggles aria-pressed as a filter chip', async () => {
    render(<Harness />);
    const tag = screen.getByRole('button', { name: 'Image' });
    expect(tag).toHaveAttribute('aria-pressed', 'false');
    expect(tag).toHaveAttribute('data-id', 'image');
    await userEvent.click(tag);
    expect(tag).toHaveAttribute('aria-pressed', 'true');
  });

  it('omits aria-pressed when it is not a toggle', () => {
    render(<Tag>Plain</Tag>);
    expect(screen.getByRole('button', { name: 'Plain' })).not.toHaveAttribute('aria-pressed');
  });
});
