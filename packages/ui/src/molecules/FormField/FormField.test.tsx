import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { Input } from '../../atoms/Input/Input';
import { RadioGroup, RadioGroupItem } from '../../atoms/RadioGroup/RadioGroup';
import { FormField } from './FormField';

const SLUG_HELP = 'Só letras minúsculas, números e hífen.';
const SLUG_ERROR = 'Esse endereço já está em uso.';

// Radix measures the hidden radio input inside a form; jsdom has no ResizeObserver.
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

describe('FormField', () => {
  it('names the control by its label and describes it with the help text', async () => {
    const user = userEvent.setup();
    render(
      <FormField label="Endereço da loja" description={SLUG_HELP}>
        <Input suffix=".purpler.com.br" />
      </FormField>
    );
    const input = screen.getByRole('textbox', { name: 'Endereço da loja' });

    await user.click(screen.getByText('Endereço da loja'));

    expect(input).toHaveFocus();
    expect(input).toHaveAccessibleDescription(`.purpler.com.br ${SLUG_HELP}`);
    expect(input).toBeValid();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('marks the control invalid and links one alert with the error after the help text', () => {
    render(
      <FormField label="Endereço da loja" description={SLUG_HELP} error={SLUG_ERROR}>
        <Input />
      </FormField>
    );
    const input = screen.getByRole('textbox', { name: 'Endereço da loja' });

    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription(`${SLUG_HELP} ${SLUG_ERROR}`);
    expect(screen.getAllByRole('alert')).toHaveLength(1);
    expect(screen.getByRole('alert')).toHaveTextContent(SLUG_ERROR);
  });

  it('shows the error when it arrives and clears it when it is fixed', () => {
    const { rerender } = render(
      <FormField label="Nome da loja">
        <Input />
      </FormField>
    );

    rerender(
      <FormField label="Nome da loja" error="Informe o nome da loja.">
        <Input />
      </FormField>
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Informe o nome da loja.');

    rerender(
      <FormField label="Nome da loja">
        <Input />
      </FormField>
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Nome da loja' })).not.toHaveAttribute(
      'aria-describedby'
    );
  });

  it('keeps a given id and passes register-style props through to the input', async () => {
    const user = userEvent.setup();
    const ref = vi.fn();
    const onChange = vi.fn();
    const onBlur = vi.fn();
    render(
      <FormField label="Nome da loja" id="store-name">
        <Input name="name" ref={ref} onChange={onChange} onBlur={onBlur} />
      </FormField>
    );
    const input = screen.getByRole('textbox', { name: 'Nome da loja' });

    await user.type(input, 'Ana');
    await user.tab();

    expect(input).toHaveAttribute('id', 'store-name');
    expect(input).toHaveAttribute('name', 'name');
    expect(ref).toHaveBeenCalledWith(input);
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('names a radio group, which a label element cannot do', () => {
    render(
      <FormField label="Plano" error="Escolha um plano.">
        <RadioGroup>
          <RadioGroupItem value="basic" label="Básico" />
          <RadioGroupItem value="professional" label="Profissional" />
        </RadioGroup>
      </FormField>
    );
    const group = screen.getByRole('radiogroup', { name: 'Plano' });

    expect(group).toHaveAccessibleDescription('Escolha um plano.');
    expect(group).toHaveAttribute('aria-invalid', 'true');
  });

  it('has no accessibility violations with or without an error', async () => {
    const { container } = render(
      <form aria-label="Criar loja">
        <FormField label="Nome da loja" description="Aparece no topo da loja.">
          <Input />
        </FormField>
        <FormField label="Endereço da loja" error={SLUG_ERROR}>
          <Input suffix=".purpler.com.br" />
        </FormField>
        <FormField label="Plano">
          <RadioGroup variant="card" defaultValue="basic">
            <RadioGroupItem value="basic" label="Básico" description="Grátis" />
          </RadioGroup>
        </FormField>
      </form>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
