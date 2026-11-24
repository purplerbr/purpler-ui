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

  it('links the ids in order: addons, help text, then the error', () => {
    render(
      <FormField label="Preço" id="price" description="Use vírgula." error="Informe o preço.">
        <Input prefix="R$" suffix="por mês" />
      </FormField>
    );
    const input = screen.getByRole('textbox', { name: 'Preço' });
    const ids = input.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(input).toHaveAttribute('id', 'price');
    expect(input).toHaveAttribute('aria-labelledby', 'price-label');
    expect(ids.slice(2)).toEqual(['price-description', 'price-error']);
    expect(input).toHaveAccessibleDescription('R$ por mês Use vírgula. Informe o preço.');
    expect(document.querySelectorAll('[id="price"]')).toHaveLength(1);
  });

  it('keeps one alert when the error message changes', () => {
    const { rerender } = render(
      <FormField label="Endereço da loja" error="Informe o endereço.">
        <Input />
      </FormField>
    );
    const alert = screen.getByRole('alert');

    rerender(
      <FormField label="Endereço da loja" error={SLUG_ERROR}>
        <Input />
      </FormField>
    );

    expect(screen.getAllByRole('alert')).toEqual([alert]);
    expect(alert).toHaveTextContent(SLUG_ERROR);
  });

  it('gives each field its own ids when none is given', () => {
    render(
      <>
        <FormField label="Nome" error="Informe o nome.">
          <Input />
        </FormField>
        <FormField label="Sobrenome" error="Informe o sobrenome.">
          <Input />
        </FormField>
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Nome' })).toHaveAccessibleDescription(
      'Informe o nome.'
    );
    expect(screen.getByRole('textbox', { name: 'Sobrenome' })).toHaveAccessibleDescription(
      'Informe o sobrenome.'
    );
  });

  it('uses the id the control already has, so the label still names it', async () => {
    const user = userEvent.setup();
    render(
      <FormField label="Nome da loja" description="Aparece no topo da loja.">
        <Input id="store-name" />
      </FormField>
    );
    const input = screen.getByRole('textbox', { name: 'Nome da loja' });

    await user.click(screen.getByText('Nome da loja'));

    expect(input).toHaveAttribute('id', 'store-name');
    expect(input).toHaveFocus();
    expect(input).toHaveAccessibleDescription('Aparece no topo da loja.');
  });

  it('keeps the control own description first, then the help text and the error', () => {
    render(
      <>
        <p id="hint">Você pode trocar depois.</p>
        <FormField
          label="Nome da loja"
          description="Aparece no topo da loja."
          error="Informe o nome."
        >
          <Input aria-describedby="hint" />
        </FormField>
      </>
    );

    expect(screen.getByRole('textbox', { name: 'Nome da loja' })).toHaveAccessibleDescription(
      'Você pode trocar depois. Aparece no topo da loja. Informe o nome.'
    );
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
