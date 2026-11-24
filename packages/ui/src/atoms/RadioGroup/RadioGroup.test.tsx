import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { RadioGroup, RadioGroupItem, type RadioGroupProps } from './RadioGroup';

// Radix measures its hidden native input inside a form; jsdom has no ResizeObserver.
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

// Radix moves the focus in a timeout and checks only while the arrow is still down, as a real press.
async function pressArrowDown(user: ReturnType<typeof userEvent.setup>): Promise<void> {
  await user.keyboard('{ArrowDown>}');
  await user.keyboard('{/ArrowDown}');
}

function Plans(props: RadioGroupProps) {
  return (
    <RadioGroup aria-label="Plano" {...props}>
      <RadioGroupItem value="basic" label="Básico" description="Grátis · até 30 produtos" />
      <RadioGroupItem
        value="professional"
        label="Profissional"
        description="R$ 79,99/mês · até 100 produtos"
      />
      <RadioGroupItem
        value="enterprise"
        label="Enterprise"
        description="R$ 149,99/mês · até 150 produtos"
        badge="Em breve"
        disabled
      />
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('takes one Tab stop on the checked item and moves the choice with the arrows', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Plans defaultValue="basic" onValueChange={onValueChange} />);

    await user.tab();
    expect(screen.getByRole('radio', { name: 'Básico' })).toHaveFocus();

    await pressArrowDown(user);
    expect(screen.getByRole('radio', { name: 'Profissional' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'Profissional' })).toBeChecked();
    expect(onValueChange).toHaveBeenLastCalledWith('professional');

    // The disabled Enterprise item is skipped, so the arrow wraps to the first one.
    await pressArrowDown(user);
    expect(screen.getByRole('radio', { name: 'Básico' })).toBeChecked();
  });

  // A click on the rest of the card reaches the label's overlay; that needs layout (Playwright).
  it('selects when the label of a card is clicked', async () => {
    const user = userEvent.setup();
    render(<Plans variant="card" />);

    await user.click(screen.getByText('Profissional'));
    expect(screen.getByRole('radio', { name: 'Profissional' })).toBeChecked();

    await user.click(screen.getByText('Básico'));
    expect(screen.getByRole('radio', { name: 'Básico' })).toBeChecked();
  });

  it('reads the badge and the description of a disabled item and never selects it', async () => {
    const user = userEvent.setup();
    render(<Plans variant="card" />);
    const enterprise = screen.getByRole('radio', { name: 'Enterprise' });

    await user.click(screen.getByText('Enterprise'));

    expect(enterprise).toBeDisabled();
    expect(enterprise).not.toBeChecked();
    expect(enterprise).toHaveAccessibleDescription('Em breve R$ 149,99/mês · até 150 produtos');
  });

  it('follows the value prop when controlled', () => {
    const { rerender } = render(<Plans value="basic" />);
    expect(screen.getByRole('radio', { name: 'Básico' })).toBeChecked();

    rerender(<Plans value="professional" />);
    expect(screen.getByRole('radio', { name: 'Profissional' })).toBeChecked();
  });

  it('sends the chosen value with the form', async () => {
    const user = userEvent.setup();
    render(
      <form aria-label="Criar loja">
        <Plans name="plan" />
      </form>
    );

    await user.click(screen.getByText('Profissional'));

    const form = screen.getByRole('form', { name: 'Criar loja' });
    expect(new FormData(form as HTMLFormElement).get('plan')).toBe('professional');
  });

  it('keeps a given item id', () => {
    render(
      <RadioGroup aria-label="Frete">
        <RadioGroupItem id="pickup" value="pickup" label="Retirar na loja" />
      </RadioGroup>
    );

    expect(screen.getByRole('radio', { name: 'Retirar na loja' })).toHaveAttribute('id', 'pickup');
  });

  it('has no accessibility violations in either variant', async () => {
    const { container } = render(
      <div>
        <Plans defaultValue="basic" />
        <Plans variant="card" defaultValue="professional" aria-label="Plano em cartões" />
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
