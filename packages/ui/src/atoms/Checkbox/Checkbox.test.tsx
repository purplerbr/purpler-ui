import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Checkbox } from './Checkbox';

const TERMS = 'Li e aceito os termos de uso';

// Inside a form, Radix measures its hidden native input; jsdom has no ResizeObserver.
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
  );
});

describe('Checkbox', () => {
  it('is named by its label and toggles when the label is clicked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label={TERMS} onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox', { name: TERMS });

    await user.click(screen.getByText(TERMS));

    expect(checkbox).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('is reachable with Tab and toggles with Space', async () => {
    const user = userEvent.setup();
    render(<Checkbox label={TERMS} />);
    const checkbox = screen.getByRole('checkbox', { name: TERMS });

    await user.tab();
    expect(checkbox).toHaveFocus();

    await user.keyboard(' ');
    expect(checkbox).toBeChecked();

    await user.keyboard(' ');
    expect(checkbox).not.toBeChecked();
  });

  it('does not submit the form when Enter is pressed on it', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <form aria-label="Entrar" onSubmit={onSubmit}>
        <Checkbox label={TERMS} />
      </form>
    );

    await user.tab();
    await user.keyboard('{Enter}');

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('checkbox', { name: TERMS })).not.toBeChecked();
  });

  it('sends its value with the form when checked', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.SyntheticEvent) => {
      event.preventDefault();
    });
    render(
      <form aria-label="Entrar" onSubmit={onSubmit}>
        <Checkbox label={TERMS} name="terms" value="accepted" />
        <button type="submit">Continuar</button>
      </form>
    );

    await user.click(screen.getByRole('checkbox', { name: TERMS }));
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    const form = screen.getByRole('form', { name: 'Entrar' });
    expect(new FormData(form as HTMLFormElement).get('terms')).toBe('accepted');
  });

  it('does not toggle or take focus when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox label={TERMS} disabled onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox', { name: TERMS });

    await user.click(screen.getByText(TERMS));
    await user.tab();

    expect(checkbox).toBeDisabled();
    expect(checkbox).not.toHaveFocus();
    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it('exposes the indeterminate state as mixed and becomes checked on Space', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Selecionar todos os pedidos" defaultChecked="indeterminate" />);
    const checkbox = screen.getByRole('checkbox', { name: 'Selecionar todos os pedidos' });

    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');

    await user.tab();
    await user.keyboard(' ');

    expect(checkbox).toHaveAttribute('aria-checked', 'true');
  });

  it('follows the checked prop when controlled', () => {
    const { rerender } = render(<Checkbox label={TERMS} checked />);
    expect(screen.getByRole('checkbox', { name: TERMS })).toBeChecked();

    rerender(<Checkbox label={TERMS} checked={false} />);
    expect(screen.getByRole('checkbox', { name: TERMS })).not.toBeChecked();
  });

  it('keeps a given id and renders only the box without a label', () => {
    render(
      <>
        <Checkbox id="newsletter" />
        <label htmlFor="newsletter">Quero receber novidades</label>
      </>
    );

    expect(screen.getByRole('checkbox', { name: 'Quero receber novidades' })).toHaveAttribute(
      'id',
      'newsletter'
    );
  });

  it('forwards the ref to the checkbox button (React 19 ref prop)', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Checkbox ref={ref} aria-label="Selecionar pedido #1001" />);

    expect(ref.current).toBe(screen.getByRole('checkbox', { name: 'Selecionar pedido #1001' }));
  });

  it('has no accessibility violations in any state', async () => {
    const { container } = render(
      <div>
        <Checkbox label="Desmarcado" />
        <Checkbox label="Marcado" defaultChecked />
        <Checkbox label="Parcial" defaultChecked="indeterminate" />
        <Checkbox label="Desativado" disabled />
        <Checkbox label="Desativado e marcado" disabled defaultChecked />
        <Checkbox aria-label="Selecionar pedido #1001" />
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
