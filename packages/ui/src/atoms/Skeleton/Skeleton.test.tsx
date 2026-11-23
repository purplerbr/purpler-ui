import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Skeleton } from './Skeleton';

function LoadingOrders() {
  return (
    <div aria-busy="true">
      <span role="status">Carregando pedidos…</span>
      <Skeleton data-testid="line" className="h-4 w-48" />
      <Skeleton className="size-10 rounded-full" />
    </div>
  );
}

describe('Skeleton', () => {
  it('stays out of the accessibility tree', () => {
    render(<Skeleton data-testid="line" />);

    expect(screen.getByTestId('line')).toHaveAttribute('aria-hidden', 'true');
  });

  it('cannot be exposed to assistive technology through props', () => {
    render(<Skeleton data-testid="line" aria-hidden={false} />);

    expect(screen.getByTestId('line')).toHaveAttribute('aria-hidden', 'true');
  });

  it('leaves the announcement to its container', () => {
    render(<LoadingOrders />);

    expect(screen.getByRole('status')).toHaveTextContent('Carregando pedidos…');
    expect(screen.getByRole('status').parentElement).toHaveAttribute('aria-busy', 'true');
  });

  // jsdom does not evaluate media queries; the browser check lives in the Storybook spec.
  it('stops pulsing under reduced motion', () => {
    render(<Skeleton data-testid="line" />);

    expect(screen.getByTestId('line')).toHaveClass('animate-pulse', 'motion-reduce:animate-none');
  });

  it('forwards the ref', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Skeleton ref={ref} data-testid="line" />);

    expect(ref.current).toBe(screen.getByTestId('line'));
  });

  it('has no accessibility violations', async () => {
    const { container } = render(
      <main>
        <h1>Pedidos</h1>
        <LoadingOrders />
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
