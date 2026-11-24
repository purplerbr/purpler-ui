import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion';

const QUESTION = 'O dinheiro das vendas cai na minha conta?';
const ANSWER = 'Cai, sim. O valor vai direto para a sua conta.';

function Faq({ name, open }: { name?: string; open?: boolean }) {
  return (
    <Accordion>
      <AccordionItem name={name} open={open}>
        <AccordionTrigger>{QUESTION}</AccordionTrigger>
        <AccordionContent>{ANSWER}</AccordionContent>
      </AccordionItem>
      <AccordionItem name={name}>
        <AccordionTrigger>Posso usar o domínio da minha marca?</AccordionTrigger>
        <AccordionContent>Pode, em qualquer plano.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const itemOf = (text: string) => screen.getByText(text).closest('details');

describe('Accordion', () => {
  it('server-renders native details with every answer in the HTML, so it works without JS', () => {
    const html = renderToString(<Faq />);

    expect(html).toContain('<details');
    expect(html).toContain(`<summary`);
    expect(html).toContain(ANSWER);
  });

  it('starts closed, and open when the item asks for it', () => {
    const { rerender } = render(<Faq />);
    expect(itemOf(QUESTION)).not.toHaveAttribute('open');

    rerender(<Faq open />);
    expect(itemOf(QUESTION)).toHaveAttribute('open');
  });

  it('opens and closes when the question is clicked', async () => {
    const user = userEvent.setup();
    render(<Faq />);

    await user.click(screen.getByText(QUESTION));
    expect(itemOf(QUESTION)).toHaveAttribute('open');
    await user.click(screen.getByText(QUESTION));
    expect(itemOf(QUESTION)).not.toHaveAttribute('open');
  });

  it('puts each question in the tab order', async () => {
    const user = userEvent.setup();
    render(<Faq />);

    await user.tab();
    expect(screen.getByText(QUESTION)).toHaveFocus();
    await user.tab();
    expect(screen.getByText('Posso usar o domínio da minha marca?')).toHaveFocus();
  });

  it('hides the chevron from assistive technology', () => {
    render(<Faq />);

    expect(screen.getByText(QUESTION).querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });

  it('forwards refs and native attributes', () => {
    const ref = { current: null as HTMLDetailsElement | null };
    render(
      <Accordion id="faq">
        <AccordionItem ref={ref} id="faq-money">
          <AccordionTrigger>{QUESTION}</AccordionTrigger>
          <AccordionContent>{ANSWER}</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(ref.current).toBe(itemOf(QUESTION));
    expect(ref.current).toHaveAttribute('id', 'faq-money');
  });

  it('has no accessibility violations, closed or open', async () => {
    const { container } = render(
      <main>
        <h1>Perguntas frequentes</h1>
        <Faq open />
      </main>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
