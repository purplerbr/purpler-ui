import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Alert, AlertDescription, AlertTitle } from './Alert';

const VARIANTS = ['info', 'success', 'warning', 'destructive'] as const;

describe('Alert', () => {
  it.each([
    ['info', 'status'],
    ['success', 'status'],
    ['warning', 'status'],
    ['destructive', 'alert'],
  ] as const)('uses role "%s" → %s', (variant, role) => {
    render(
      <Alert variant={variant}>
        <AlertTitle>Não foi possível entrar</AlertTitle>
        <AlertDescription>Tente de novo em alguns minutos.</AlertDescription>
      </Alert>
    );

    expect(screen.getByRole(role)).toHaveTextContent(
      'Não foi possível entrarTente de novo em alguns minutos.'
    );
  });

  it('is a polite status with the info icon by default', () => {
    render(<Alert>Sua loja ainda não foi publicada.</Alert>);

    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Sua loja ainda não foi publicada.');
    expect(status.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('lets the caller override the role', () => {
    render(
      <Alert variant="destructive" role="note">
        Pagamento recusado
      </Alert>
    );

    expect(screen.getByRole('note')).toHaveTextContent('Pagamento recusado');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('forwards the ref to the root element (React 19 ref prop)', () => {
    const ref = { current: null as HTMLDivElement | null };
    render(<Alert ref={ref}>Pedido enviado</Alert>);

    expect(ref.current).toBe(screen.getByRole('status'));
  });

  it('has no accessibility violations in any variant', async () => {
    const { container } = render(
      <div>
        {VARIANTS.map((variant) => (
          <Alert key={variant} variant={variant}>
            <AlertTitle>Título do aviso</AlertTitle>
            <AlertDescription>Descrição do aviso.</AlertDescription>
          </Alert>
        ))}
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
