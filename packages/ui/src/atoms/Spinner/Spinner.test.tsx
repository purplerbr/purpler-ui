import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('is a status region announcing "Carregando…" by default', () => {
    render(<Spinner />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando…');
  });

  it('announces the label it is given', () => {
    render(<Spinner label="Carregando pedidos…" />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando pedidos…');
  });

  it('hides the ring icon from assistive technology', () => {
    render(<Spinner />);

    const icon = screen.getByRole('status').querySelector('svg');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });

  // jsdom does not evaluate media queries; the browser check lives in the Storybook spec.
  it('stops the ring and reveals the label under reduced motion', () => {
    render(<Spinner />);

    const status = screen.getByRole('status');
    expect(status.querySelector('svg')).toHaveClass('motion-reduce:animate-none');
    expect(screen.getByText('Carregando…')).toHaveClass('sr-only', 'motion-reduce:not-sr-only');
  });

  it('shows the label on screen when showLabel is on', () => {
    render(<Spinner showLabel label="Carregando o painel…" />);

    expect(screen.getByText('Carregando o painel…')).not.toHaveClass('sr-only');
  });

  it('forwards the ref and native attributes', () => {
    const ref = { current: null as HTMLSpanElement | null };
    render(<Spinner ref={ref} id="route-loading" aria-live="assertive" />);

    const status = screen.getByRole('status');
    expect(ref.current).toBe(status);
    expect(status).toHaveAttribute('id', 'route-loading');
    expect(status).toHaveAttribute('aria-live', 'assertive');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <h1>Pedidos</h1>
        <Spinner size="sm" />
        <Spinner size="lg" showLabel label="Carregando o painel…" />
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
