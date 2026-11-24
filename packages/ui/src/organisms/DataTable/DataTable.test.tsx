import { act, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { DataTable, type DataTableColumn, type DataTablePagination } from './DataTable';
import { useTableUrlState } from './useTableUrlState';

interface Product {
  id: string;
  name: string;
  status: string;
  priceCents: number;
}

const PRODUCTS: Product[] = [
  { id: 'p1', name: 'Bolo de cenoura', status: 'Ativo', priceCents: 4500 },
  { id: 'p2', name: 'Brigadeiro (cento)', status: 'Rascunho', priceCents: 12000 },
];

const COLUMNS: DataTableColumn<Product>[] = [
  { key: 'name', header: 'Produto', cell: (row) => row.name, sortable: true },
  { key: 'status', header: 'Status', cell: (row) => row.status },
  {
    key: 'price',
    header: 'Preço',
    cell: (row) => `R$ ${(row.priceCents / 100).toFixed(2).replace('.', ',')}`,
    sortable: true,
    align: 'end',
  },
];

const page = (current: number, totalPages = 3): DataTablePagination => ({
  page: current,
  limit: 2,
  total: totalPages * 2,
  totalPages,
  hasNext: current < totalPages,
  hasPrev: current > 1,
});

const base = {
  caption: 'Produtos',
  columns: COLUMNS,
  getRowKey: (row: Product) => row.id,
};

describe('DataTable', () => {
  it('renders a plain table named by its caption, with no sort or pagination', () => {
    render(<DataTable {...base} rows={PRODUCTS} />);
    const table = screen.getByRole('table', { name: 'Produtos' });

    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((th) => th.textContent)
    ).toEqual(['Produto', 'Status', 'Preço']);
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(within(table).getByRole('cell', { name: 'R$ 120,00' })).toBeInTheDocument();
    expect(within(table).queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Produtos' })).toHaveAttribute('tabindex', '0');
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('marks the sorted column and sorts from a button in the header, also with Enter', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <DataTable {...base} rows={PRODUCTS} sort="price" order="desc" onSortChange={onSortChange} />
    );
    const [name, status, price] = screen.getAllByRole('columnheader');

    expect(name).toHaveAttribute('aria-sort', 'none');
    expect(status).not.toHaveAttribute('aria-sort');
    expect(price).toHaveAttribute('aria-sort', 'descending');
    expect(within(status as HTMLElement).queryByRole('button')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Preço' }));
    screen.getByRole('button', { name: 'Produto' }).focus();
    await user.keyboard('{Enter}');

    expect(onSortChange.mock.calls).toEqual([['price'], ['name']]);
  });

  it('pages through a named navigation and says which page is showing', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <DataTable {...base} rows={PRODUCTS} pagination={page(2)} onPageChange={onPageChange} />
    );
    const nav = screen.getByRole('navigation', { name: 'Paginação: Produtos' });

    expect(within(nav).getByRole('status')).toHaveTextContent('Página 2 de 3');
    await user.click(within(nav).getByRole('button', { name: 'Próxima página' }));
    await user.click(within(nav).getByRole('button', { name: 'Página anterior' }));

    expect(onPageChange.mock.calls).toEqual([[3], [1]]);
  });

  it('keeps the focus on a button that the last page disables, and ignores it', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <DataTable {...base} rows={PRODUCTS} pagination={page(3)} onPageChange={onPageChange} />
    );
    const next = screen.getByRole('button', { name: 'Próxima página' });

    next.focus();
    await user.keyboard('{Enter}');

    expect(next).toHaveAttribute('aria-disabled', 'true');
    expect(next).toHaveFocus();
    expect(onPageChange).not.toHaveBeenCalled();
  });

  it('hides the pagination when everything fits in one page', () => {
    render(<DataTable {...base} rows={PRODUCTS} pagination={page(1, 1)} />);

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('shows placeholder rows and announces the loading of the first page', () => {
    render(<DataTable {...base} rows={undefined} pagination={undefined} />);

    expect(screen.getByRole('table', { name: 'Produtos' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText('Carregando: Produtos')).toHaveAttribute('role', 'status');
    expect(screen.getAllByRole('row')).toHaveLength(6);
    expect(screen.queryByRole('cell', { name: 'Bolo de cenoura' })).not.toBeInTheDocument();
  });

  it('keeps the rows on screen while the next page loads', () => {
    render(<DataTable {...base} rows={PRODUCTS} loading pagination={page(1)} />);

    expect(screen.getByRole('cell', { name: 'Bolo de cenoura' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: 'Produtos' })).toHaveAttribute('aria-busy', 'true');
  });

  it('shows the empty state instead of an empty table', () => {
    render(
      <DataTable
        {...base}
        rows={[]}
        pagination={page(1, 0)}
        empty={{ title: 'Nenhum produto com esse status', titleLevel: 3 }}
      />
    );

    expect(
      screen.getByRole('heading', { level: 3, name: 'Nenhum produto com esse status' })
    ).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('shows a default empty title', () => {
    render(<DataTable {...base} rows={[]} />);

    expect(screen.getByRole('heading', { name: 'Nenhum item encontrado' })).toBeInTheDocument();
  });

  it('replaces the table with an alert and retries from it', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <DataTable
        {...base}
        rows={undefined}
        error="Confira sua conexão e tente de novo."
        onRetry={onRetry}
        pagination={page(1)}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível carregar: ProdutosConfira sua conexão e tente de novo.'
    );
    await user.click(screen.getByRole('button', { name: 'Tentar de novo' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
    expect(screen.queryByText('Carregando: Produtos')).not.toBeInTheDocument();
  });

  it('has no accessibility violations in any mode', async () => {
    const { container } = render(
      <div>
        <DataTable {...base} caption="Simples" rows={PRODUCTS} />
        <DataTable
          {...base}
          caption="Com ordenação"
          rows={PRODUCTS}
          sort="name"
          order="asc"
          onSortChange={vi.fn()}
          pagination={page(1)}
          onPageChange={vi.fn()}
        />
        <DataTable {...base} caption="Carregando" rows={undefined} />
        <DataTable
          {...base}
          caption="Vazia"
          rows={[]}
          empty={{ title: 'Nada aqui', titleLevel: 3 }}
        />
        <DataTable
          {...base}
          caption="Com erro"
          rows={undefined}
          error="Falhou."
          onRetry={vi.fn()}
        />
      </div>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

function ProductsPage() {
  const table = useTableUrlState({ sortable: ['name', 'price'], limits: [2] });
  return (
    <DataTable
      {...base}
      rows={PRODUCTS}
      pagination={page(table.state.page)}
      onPageChange={table.setPage}
      sort={table.state.sort}
      order={table.state.order}
      onSortChange={table.toggleSort}
    />
  );
}

describe('DataTable with useTableUrlState', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('opens a shared link sorted and paged, and writes clicks back to the URL', async () => {
    const user = userEvent.setup();
    window.history.replaceState(null, '', '/produtos?sort=price&order=desc&page=2');
    render(<ProductsPage />);

    expect(screen.getAllByRole('columnheader')[2]).toHaveAttribute('aria-sort', 'descending');
    expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Próxima página' }));
    expect(window.location.search).toBe('?sort=price&order=desc&page=3');

    await user.click(screen.getByRole('button', { name: 'Produto' }));
    expect(window.location.search).toBe('?sort=name&order=asc');
    expect(screen.getAllByRole('columnheader')[0]).toHaveAttribute('aria-sort', 'ascending');

    act(() => {
      window.history.replaceState(null, '', '/produtos?sort=price&order=desc&page=3');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(screen.getByText('Página 3 de 3')).toBeInTheDocument();
  });
});
