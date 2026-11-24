import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Badge } from './Badge';

const VARIANTS = [
  'primary',
  'secondary',
  'accent',
  'outline',
  'success',
  'warning',
  'info',
  'destructive',
] as const;

describe('Badge', () => {
  it('reads as plain text inside its parent', () => {
    render(
      <h2>
        Profissional <Badge>Mais popular</Badge>
      </h2>
    );

    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Profissional Mais popular'
    );
  });

  it('is not a stop in the tab order', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Badge>Rascunho</Badge>
        <button type="button">Publicar</button>
      </>
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Publicar' })).toHaveFocus();
  });

  it('forwards the ref and native attributes', () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(
      <Badge ref={ref} id="plan-badge" title="Plano escolhido pela maioria">
        Mais popular
      </Badge>
    );

    const badge = screen.getByText('Mais popular');
    expect(ref.current).toBe(badge);
    expect(badge).toHaveAttribute('id', 'plan-badge');
    expect(badge).toHaveAttribute('title', 'Plano escolhido pela maioria');
  });

  it('has no accessibility violations in any variant', async () => {
    const { container } = render(
      <main>
        <h1>Planos</h1>
        {VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
