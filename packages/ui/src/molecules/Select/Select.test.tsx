import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { FormField } from '../FormField/FormField';
import { Select, type SelectProps } from './Select';

const CATEGORIES = [
  { value: 'bolos', label: 'Bolos' },
  { value: 'doces', label: 'Doces' },
  { value: 'salgados', label: 'Salgados', disabled: true },
];

// Radix positions the list with ResizeObserver and pointer capture, which jsdom lacks.
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
  );
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.releasePointerCapture = () => undefined;
  Element.prototype.scrollIntoView = () => undefined;
});

function Category(props: Partial<SelectProps> & { error?: string }) {
  const { error, ...rest } = props;
  return (
    <FormField label="Categoria" description="Onde o produto aparece na loja." error={error}>
      <Select options={CATEGORIES} placeholder="Escolha uma categoria" {...rest} />
    </FormField>
  );
}

describe('Select', () => {
  it('is named by the FormField label and shows the placeholder', () => {
    render(<Category />);

    const trigger = screen.getByRole('combobox', { name: 'Categoria' });
    expect(trigger).toHaveTextContent('Escolha uma categoria');
    expect(trigger).toHaveAccessibleDescription('Onde o produto aparece na loja.');
  });

  it('opens with the keyboard, skips disabled options and picks with Enter', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Category onValueChange={onValueChange} />);

    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Salgados' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );

    await user.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}{Enter}');

    expect(onValueChange).toHaveBeenLastCalledWith('doces');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Categoria' })).toHaveTextContent('Doces');
    expect(screen.getByRole('combobox', { name: 'Categoria' })).toHaveFocus();
  });

  it('closes on Escape and keeps the value', async () => {
    const user = userEvent.setup();
    render(<Category defaultValue="bolos" />);
    const trigger = screen.getByRole('combobox', { name: 'Categoria' });

    await user.click(trigger);
    expect(screen.getByRole('option', { name: 'Bolos' })).toHaveAttribute('aria-selected', 'true');
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(trigger).toHaveTextContent('Bolos');
    expect(trigger).toHaveFocus();
  });

  it('offers the “all” option first and reports it as an empty value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    function Filter() {
      const [value, setValue] = useState('doces');
      return (
        <Select
          aria-label="Filtrar por categoria"
          options={CATEGORIES}
          allLabel="Todas as categorias"
          value={value}
          onValueChange={(next) => {
            setValue(next);
            onValueChange(next);
          }}
        />
      );
    }
    render(<Filter />);
    const trigger = screen.getByRole('combobox', { name: 'Filtrar por categoria' });

    await user.click(trigger);
    expect(screen.getAllByRole('option')[0]).toHaveAccessibleName('Todas as categorias');
    await user.click(screen.getByRole('option', { name: 'Todas as categorias' }));

    expect(onValueChange).toHaveBeenLastCalledWith('');
    expect(trigger).toHaveTextContent('Todas as categorias');
  });

  it('shows the “all” option when the value is empty', () => {
    render(<Select aria-label="Filtrar" options={CATEGORIES} allLabel="Todas" value="" />);

    expect(screen.getByRole('combobox', { name: 'Filtrar' })).toHaveTextContent('Todas');
  });

  it('marks the trigger invalid and describes it with the error', () => {
    render(<Category error="Escolha a categoria do produto." />);
    const trigger = screen.getByRole('combobox', { name: 'Categoria' });

    expect(trigger).toHaveAttribute('aria-invalid', 'true');
    expect(trigger).toHaveAccessibleDescription(
      'Onde o produto aparece na loja. Escolha a categoria do produto.'
    );
  });

  it('does not open or take focus when disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Category disabled onValueChange={onValueChange} />);
    const trigger = screen.getByRole('combobox', { name: 'Categoria' });

    await user.click(trigger);
    await user.tab();

    expect(trigger).toBeDisabled();
    expect(trigger).not.toHaveFocus();
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('has no accessibility violations closed, with error and open', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <Category />
        <Category error="Escolha a categoria do produto." />
        <Category disabled />
        <Select aria-label="Filtrar por categoria" options={CATEGORIES} allLabel="Todas" />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();

    await user.click(screen.getByRole('combobox', { name: 'Filtrar por categoria' }));
    expect(await axe(screen.getByRole('listbox'))).toHaveNoViolations();
  });
});
