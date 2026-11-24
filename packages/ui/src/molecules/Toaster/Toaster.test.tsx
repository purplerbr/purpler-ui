import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { toast } from './index';
import { Toaster } from './Toaster';

afterEach(() => {
  act(() => {
    toast.dismiss();
  });
});

describe('Toaster', () => {
  it('announces toasts politely in a region named in pt-BR', async () => {
    render(<Toaster />);

    act(() => {
      toast.success('Loja criada', { description: 'Ela já aparece no seu painel.' });
    });

    const region = screen.getByRole('region', { name: 'Notificações (Alt+T)' });
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(await within(region).findByText('Loja criada')).toBeVisible();
    expect(within(region).getByText('Ela já aparece no seu painel.')).toBeVisible();
  });

  it('runs the action from the keyboard', async () => {
    const user = userEvent.setup();
    const onUndo = vi.fn();
    render(<Toaster />);

    act(() => {
      toast('Produto arquivado', { action: { label: 'Desfazer', onClick: onUndo } });
    });
    const undo = await screen.findByRole('button', { name: 'Desfazer' });
    undo.focus();
    await user.keyboard('{Enter}');

    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it('labels the close button in pt-BR and closes the toast with it', async () => {
    const user = userEvent.setup();
    render(<Toaster closeButton />);

    act(() => {
      toast.error('Não foi possível salvar');
    });
    // jsdom has no pointer capture, which sonner's swipe uses on pointerdown; Enter skips it.
    (await screen.findByRole('button', { name: 'Fechar notificação' })).focus();
    await user.keyboard('{Enter}');

    await vi.waitFor(() => {
      expect(screen.queryByText('Não foi possível salvar')).not.toBeInTheDocument();
    });
  });

  it('keeps custom toast options next to its own defaults', async () => {
    render(<Toaster toastOptions={{ closeButton: true, classNames: { title: 'underline' } }} />);

    act(() => {
      toast.info('Rascunho salvo');
    });

    expect(await screen.findByRole('button', { name: 'Fechar notificação' })).toBeVisible();
  });

  it('has no accessibility violations with every toast type on screen', async () => {
    const { container } = render(<Toaster expand closeButton />);

    act(() => {
      toast('Rascunho salvo');
      toast.success('Loja criada');
      toast.info('Seu domínio está em verificação');
      toast.warning('Faltam 2 produtos para o limite do plano');
      toast.error('Não foi possível salvar');
    });
    await screen.findByText('Não foi possível salvar');

    expect(await axe(container)).toHaveNoViolations();
  });
});
