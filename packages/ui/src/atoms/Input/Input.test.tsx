import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Input } from './Input';

describe('Input', () => {
  it('is reachable with Tab and keeps what the user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input aria-label="Nome da loja" onChange={onChange} />);
    const input = screen.getByRole('textbox', { name: 'Nome da loja' });

    await user.tab();
    expect(input).toHaveFocus();
    await user.keyboard('Doces da Ana');

    expect(input).toHaveValue('Doces da Ana');
    expect(onChange).toHaveBeenCalledTimes(12);
  });

  it('keeps the suffix out of the value and reads it as the description', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Endereço da loja" suffix=".purpler.com.br" />);
    const input = screen.getByRole('textbox', { name: 'Endereço da loja' });

    await user.type(input, 'docesdaana');

    expect(input).toHaveValue('docesdaana');
    expect(input).toHaveAccessibleDescription('.purpler.com.br');
  });

  it('reads the prefix and suffix before a description it was given', () => {
    render(
      <>
        <Input aria-label="Preço" prefix="R$" suffix="por mês" aria-describedby="hint" />
        <p id="hint">Use vírgula para os centavos</p>
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Preço' })).toHaveAccessibleDescription(
      'R$ por mês Use vírgula para os centavos'
    );
  });

  it('keeps a description without addons and adds none of its own', () => {
    render(
      <>
        <Input aria-label="Nome da loja" aria-describedby="hint" />
        <p id="hint">Aparece no topo da loja</p>
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Nome da loja' })).toHaveAccessibleDescription(
      'Aparece no topo da loja'
    );
  });

  it('does not take focus or text when disabled, with or without an addon', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Input aria-label="Nome da loja" disabled defaultValue="Doces da Ana" />
        <Input aria-label="Endereço da loja" disabled suffix=".purpler.com.br" />
      </>
    );

    await user.tab();
    await user.type(screen.getByRole('textbox', { name: 'Nome da loja' }), 'x');

    expect(document.body).toHaveFocus();
    expect(screen.getByRole('textbox', { name: 'Nome da loja' })).toHaveValue('Doces da Ana');
    expect(screen.getByRole('textbox', { name: 'Endereço da loja' })).toBeDisabled();
  });

  it('exposes the error state on the input itself', () => {
    render(<Input aria-label="Endereço da loja" suffix=".purpler.com.br" aria-invalid />);

    expect(screen.getByRole('textbox', { name: 'Endereço da loja' })).toBeInvalid();
  });

  it('forwards the ref to the input, also with an addon (React 19 ref prop)', () => {
    const ref = { current: null as HTMLInputElement | null };
    render(<Input ref={ref} aria-label="Endereço da loja" suffix=".purpler.com.br" />);

    expect(ref.current).toBe(screen.getByRole('textbox', { name: 'Endereço da loja' }));
  });

  it('has no accessibility violations in any state', async () => {
    const { container } = render(
      <div>
        <Input aria-label="Nome da loja" placeholder="Doces da Ana" />
        <Input aria-label="Endereço da loja" suffix=".purpler.com.br" />
        <Input aria-label="Preço" prefix="R$" inputMode="decimal" />
        <Input aria-label="E-mail" type="email" aria-invalid />
        <Input aria-label="Plano" disabled defaultValue="Básico" />
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
