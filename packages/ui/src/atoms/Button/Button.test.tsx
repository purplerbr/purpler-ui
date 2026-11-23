import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Plus } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Button } from './Button';

const VARIANTS = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;

describe('Button', () => {
  it('renders a button of type "button" by default', () => {
    render(<Button>Salvar</Button>);

    expect(screen.getByRole('button', { name: 'Salvar' })).toHaveAttribute('type', 'button');
  });

  it('fires onClick when clicked and when activated with Enter or Space', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Salvar</Button>);

    await user.click(screen.getByRole('button', { name: 'Salvar' }));
    await user.tab();
    await user.tab({ shift: true });
    await user.keyboard('{Enter}');
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('is reachable with Tab and shows the focus on it', async () => {
    const user = userEvent.setup();
    render(<Button>Publicar loja</Button>);

    await user.tab();

    expect(screen.getByRole('button', { name: 'Publicar loja' })).toHaveFocus();
  });

  it('submits the form only when type is "submit"', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn((event: React.SyntheticEvent) => {
      event.preventDefault();
    });
    render(
      <form aria-label="Produto" onSubmit={onSubmit}>
        <Button>Cancelar</Button>
        <Button type="submit">Salvar produto</Button>
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'Cancelar' }));
    expect(onSubmit).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: 'Salvar produto' }));
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not fire or take focus when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Excluir
      </Button>
    );

    await user.click(screen.getByRole('button', { name: 'Excluir' }));
    await user.tab();

    expect(onClick).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Excluir' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Excluir' })).not.toHaveFocus();
  });

  it('while loading, keeps the focus, is marked busy and blocks clicks and submits', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn();
    render(
      <form aria-label="Pedido" onSubmit={onSubmit}>
        <Button type="submit" loading onClick={onClick}>
          Salvando
        </Button>
      </form>
    );
    const button = screen.getByRole('button', { name: 'Salvando' });

    await user.tab();
    await user.keyboard('{Enter}');
    await user.click(button);

    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toBeEnabled();
    expect(onClick).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('renders its child with the button styles when asChild is set', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent) => {
      event.preventDefault();
    });
    render(
      <Button asChild onClick={onClick}>
        <a href="/pedidos">Ver pedidos</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Ver pedidos' });

    await user.click(link);

    expect(link).toHaveAttribute('href', '/pedidos');
    expect(link).toHaveAttribute('data-slot', 'button');
    expect(link).not.toHaveAttribute('type');
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('forwards the ref to the button element (React 19 ref prop)', () => {
    const ref = { current: null as HTMLButtonElement | null };
    render(<Button ref={ref}>Salvar</Button>);

    expect(ref.current).toBe(screen.getByRole('button', { name: 'Salvar' }));
  });

  it('names an icon-only button by its aria-label, not by the icon', () => {
    render(
      <Button size="icon" aria-label="Adicionar produto">
        <Plus aria-hidden="true" />
      </Button>
    );

    expect(screen.getByRole('button', { name: 'Adicionar produto' })).toBeInTheDocument();
  });

  it('has no accessibility violations in any variant or state', async () => {
    const { container } = render(
      <div>
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant}>
            Comprar agora
          </Button>
        ))}
        <Button disabled>Indisponível</Button>
        <Button loading>Salvando</Button>
        <Button size="icon" aria-label="Adicionar produto">
          <Plus aria-hidden="true" />
        </Button>
        <Button asChild>
          <a href="/carrinho">Ir para o carrinho</a>
        </Button>
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
