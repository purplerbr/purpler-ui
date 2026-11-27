import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog';

function Example({ onConfirm }: { onConfirm?: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger>Cancelar assinatura</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar a assinatura?</AlertDialogTitle>
          <AlertDialogDescription>A loja volta ao plano Básico.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Manter assinatura</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onConfirm}>
            Cancelar assinatura
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const trigger = () => screen.getByRole('button', { name: 'Cancelar assinatura' });

describe('AlertDialog', () => {
  it('opens an alertdialog named by its title, described by its description, focused on cancel', async () => {
    const user = userEvent.setup();
    render(<Example />);

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await user.click(trigger());

    const dialog = screen.getByRole('alertdialog', { name: 'Cancelar a assinatura?' });
    expect(dialog).toHaveAccessibleDescription('A loja volta ao plano Básico.');
    expect(screen.getByRole('button', { name: 'Manter assinatura' })).toHaveFocus();
  });

  it('keeps Tab inside the dialog while it is open', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(trigger());
    const dialog = screen.getByRole('alertdialog');
    for (let step = 0; step < 4; step += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });

  it('closes on Esc without confirming and gives the focus back to the trigger', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);

    trigger().focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('does not close on a click outside the dialog', async () => {
    // Radix turns off pointer events behind the modal; skip the check to click there anyway.
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<Example />);

    await user.click(trigger());
    await user.click(document.body);

    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it('closes from cancel without confirming and returns the focus', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);

    await user.click(trigger());
    await user.click(screen.getByRole('button', { name: 'Manter assinatura' }));

    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('confirms once and closes from the action', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(<Example onConfirm={onConfirm} />);

    await user.click(trigger());
    await user.click(
      within(screen.getByRole('alertdialog')).getByRole('button', { name: 'Cancelar assinatura' })
    );

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(trigger()).toHaveFocus();
  });

  it('has no accessibility violations while open', async () => {
    const user = userEvent.setup();
    render(<Example />);

    await user.click(trigger());

    expect(await axe(document.body)).toHaveNoViolations();
  });
});
