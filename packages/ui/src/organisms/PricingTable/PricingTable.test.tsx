import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { axe } from 'vitest-axe';
import { PricingTable } from './PricingTable';

const PLANS = [
  { id: 'basic', name: 'Básico' },
  { id: 'professional', name: 'Profissional' },
];
const ROWS = [
  { label: 'Preço por mês', values: { basic: 'Grátis', professional: 'R$ 79,99' } },
  { label: 'Entrega automática', values: { basic: false, professional: true } },
  { label: 'Hospedagem de vídeo', values: {} },
];

function cellsOf(label: string): (string | null)[] {
  const row = screen.getByRole('rowheader', { name: label }).parentElement;
  if (!row) throw new Error(`no row for ${label}`);
  return within(row)
    .getAllByRole('cell')
    .map((cell) => cell.textContent);
}

describe('PricingTable', () => {
  it('renders a table named by its caption, with one column header per plan', () => {
    render(<PricingTable caption="Comparação dos planos" plans={PLANS} rows={ROWS} />);

    const table = screen.getByRole('table', { name: 'Comparação dos planos' });
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((cell) => cell.textContent)
    ).toEqual(['Básico', 'Profissional']);
    expect(
      within(table)
        .getAllByRole('rowheader')
        .map((cell) => cell.textContent)
    ).toEqual(ROWS.map((row) => row.label));
  });

  it('shows text values as given and reads booleans as included or not', () => {
    render(<PricingTable caption="Planos" plans={PLANS} rows={ROWS} />);

    expect(cellsOf('Preço por mês')).toEqual(['Grátis', 'R$ 79,99']);
    expect(cellsOf('Entrega automática')).toEqual(['Não incluído', 'Incluído']);
    expect(cellsOf('Hospedagem de vídeo')).toEqual(['Não incluído', 'Não incluído']);
  });

  it('takes the included and not included labels from props', () => {
    render(
      <PricingTable
        caption="Planos"
        plans={PLANS}
        rows={ROWS.slice(1, 2)}
        includedLabel="Sim"
        notIncludedLabel="Não"
      />
    );

    expect(cellsOf('Entrega automática')).toEqual(['Não', 'Sim']);
  });

  it('puts the scroll region, named like the table, in the tab order', async () => {
    const user = userEvent.setup();
    render(<PricingTable caption="Comparação dos planos" plans={PLANS} rows={ROWS} />);

    await user.tab();
    expect(screen.getByRole('region', { name: 'Comparação dos planos' })).toHaveFocus();
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<PricingTable caption="Planos" plans={PLANS} rows={ROWS} />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
