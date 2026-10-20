import { render, screen } from '@testing-library/react';
import { ExternalLink } from 'lucide-react';
import { Button } from './Button';
import { buttonStyles } from './Button.styles';

describe('Button', () => {
  it('renders a typed button by default', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('with asChild renders the child element carrying the button classes', () => {
    render(
      <Button asChild variant="secondary" size="lg" iconRight={ExternalLink}>
        <a href="/tools/x">Open</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Open' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/tools/x');
    expect(link).not.toHaveAttribute('type');
    for (const cls of buttonStyles({ variant: 'secondary', size: 'lg' }).split(' ')) {
      expect(link).toHaveClass(cls);
    }
    expect(link.querySelector('svg')).not.toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('keeps its height class while loading', () => {
    render(<Button loading>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveClass('h-10');
  });
});
