import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './Sheet';

function Example({ closeLabel = 'Fechar' }: { closeLabel?: string }) {
  return (
    <Sheet>
      <SheetTrigger>Ver resumo</SheetTrigger>
      <SheetContent closeLabel={closeLabel}>
        <SheetHeader>
          <SheetTitle>Resumo do pedido</SheetTitle>
          <SheetDescription>Confira os itens.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose>Continuar comprando</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

describe('Sheet', () => {
  it('opens a modal dialog named by its title and described by its description', async () => {
    const user = userEvent.setup();
    render(<Example />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Ver resumo' }));

    const dialog = screen.getByRole('dialog', { name: 'Resumo do pedido' });
    expect(dialog).toHaveAccessibleDescription('Confira os itens.');
    // The modal hides the rest of the page from assistive technology, trigger included.
    expect(screen.getByRole('button', { name: 'Ver resumo', hidden: true })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('closes on Esc and gives the focus back to the trigger', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Ver resumo' });

    trigger.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it('keeps Tab inside the panel while it is open', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Ver resumo' }));
    const dialog = screen.getByRole('dialog');
    for (let step = 0; step < 4; step += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it('closes from the close button, named in pt-BR by default or by closeLabel', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Ver resumo' }));
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Fechar' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(<Example closeLabel="Fechar resumo" />);
    await user.click(screen.getByRole('button', { name: 'Ver resumo' }));
    await user.click(screen.getByRole('button', { name: 'Fechar resumo' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes from a SheetClose inside the content', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Ver resumo' }));
    await user.click(screen.getByRole('button', { name: 'Continuar comprando' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('has no accessibility violations while open', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(screen.getByRole('button', { name: 'Ver resumo' }));

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
