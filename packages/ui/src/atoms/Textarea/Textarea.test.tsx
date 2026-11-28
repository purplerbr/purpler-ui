import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { FormField } from '../../molecules/FormField/FormField';
import { Textarea } from './Textarea';

const HELP = 'Aparece no rodapé da loja.';
const ERROR = 'Conte como a loja usa os dados dos clientes.';

describe('Textarea', () => {
  it('is reachable with Tab and keeps line breaks the user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label="Política de trocas" onChange={onChange} />);
    const textarea = screen.getByRole('textbox', { name: 'Política de trocas' });

    await user.tab();
    expect(textarea).toHaveFocus();
    await user.keyboard('Até 7 dias{Enter}Sem uso');

    expect(textarea).toHaveValue('Até 7 dias\nSem uso');
    expect(textarea).toBeInstanceOf(HTMLTextAreaElement);
    expect(onChange).toHaveBeenCalledTimes(18);
  });

  it('starts at 6 rows and passes rows and maxLength through to the native textarea', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Textarea aria-label="Política de trocas" />
        <Textarea aria-label="Política de privacidade" rows={3} maxLength={5} />
      </>
    );
    const privacy = screen.getByRole('textbox', { name: 'Política de privacidade' });

    await user.type(privacy, 'Dados do cliente');

    expect(screen.getByRole('textbox', { name: 'Política de trocas' })).toHaveAttribute(
      'rows',
      '6'
    );
    expect(privacy).toHaveAttribute('rows', '3');
    expect(privacy).toHaveValue('Dados');
  });

  it('does not take focus or text when disabled', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Política de trocas" disabled defaultValue="Até 7 dias" />);
    const textarea = screen.getByRole('textbox', { name: 'Política de trocas' });

    await user.tab();
    await user.type(textarea, 'x');

    expect(document.body).toHaveFocus();
    expect(textarea).toHaveValue('Até 7 dias');
    expect(textarea).toBeDisabled();
  });

  it('gets the label, help text and error from FormField', async () => {
    const user = userEvent.setup();
    render(
      <FormField label="Política de privacidade" description={HELP} error={ERROR}>
        <Textarea />
      </FormField>
    );
    const textarea = screen.getByRole('textbox', { name: 'Política de privacidade' });

    await user.click(screen.getByText('Política de privacidade'));

    expect(textarea).toHaveFocus();
    expect(textarea).toBeInvalid();
    expect(textarea).toHaveAccessibleDescription(`${HELP} ${ERROR}`);
    expect(screen.getByRole('alert')).toHaveTextContent(ERROR);
  });

  it('keeps its own description first inside FormField and forwards the ref', () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(
      <>
        <FormField label="Política de trocas" description={HELP}>
          <Textarea ref={ref} aria-describedby="limit" />
        </FormField>
        <p id="limit">Até 20.000 caracteres.</p>
      </>
    );
    const textarea = screen.getByRole('textbox', { name: 'Política de trocas' });

    expect(ref.current).toBe(textarea);
    expect(textarea).toBeValid();
    expect(textarea).toHaveAccessibleDescription(`Até 20.000 caracteres. ${HELP}`);
  });

  it('has no accessibility violations in any state', async () => {
    const { container } = render(
      <div>
        <Textarea aria-label="Política de trocas" placeholder="Como devolver um produto." />
        <Textarea aria-label="Política com erro" aria-invalid />
        <Textarea aria-label="Política desativada" disabled defaultValue="Até 7 dias" />
        <FormField label="Política de privacidade" description={HELP} error={ERROR}>
          <Textarea />
        </FormField>
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
