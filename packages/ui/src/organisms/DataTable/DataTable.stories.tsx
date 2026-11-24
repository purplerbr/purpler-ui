import type { Meta, StoryObj } from '@storybook/react-vite';
import { PackageOpen } from 'lucide-react';
import { fn } from 'storybook/test';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import { DataTable, type DataTableColumn, type DataTablePagination } from './DataTable';
import { useTableUrlState } from './useTableUrlState';

interface Product {
  id: string;
  name: string;
  status: 'active' | 'draft';
  type: 'physical' | 'digital';
  priceCents: number;
}

const NAMES = [
  'Bolo de cenoura',
  'Brigadeiro (cento)',
  'Torta de limão',
  'Pão de mel',
  'Curso de confeitaria',
  'E-book de receitas',
  'Cookie recheado',
  'Bolo no pote',
  'Pudim de leite',
  'Cento de beijinho',
  'Palha italiana',
  'Kit festa',
];
const PRODUCTS: Product[] = NAMES.map((name, index) => ({
  id: `p${String(index + 1)}`,
  name,
  status: index % 3 === 0 ? 'draft' : 'active',
  type: index % 4 === 0 ? 'digital' : 'physical',
  priceCents: 1500 + ((index * 3700) % 15000),
}));

const STATUS = { active: 'Ativo', draft: 'Rascunho' } as const;
const money = (cents: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);

const COLUMNS: DataTableColumn<Product>[] = [
  { key: 'name', header: 'Produto', cell: (row) => row.name, sortable: true },
  {
    key: 'status',
    header: 'Status',
    cell: (row) => (
      <Badge variant={row.status === 'active' ? 'success' : 'secondary'}>
        {STATUS[row.status]}
      </Badge>
    ),
  },
  { key: 'type', header: 'Tipo', cell: (row) => (row.type === 'digital' ? 'Digital' : 'Físico') },
  {
    key: 'price',
    header: 'Preço',
    cell: (row) => money(row.priceCents),
    sortable: true,
    align: 'end',
  },
];

// Stands in for the API: the real sort, filter and paging happen on the backend (R8).
function fakeApi(query: {
  page: number;
  limit: number;
  sort?: string;
  order?: string;
  status?: string;
}): { items: Product[]; pagination: DataTablePagination } {
  const filtered = PRODUCTS.filter((row) => !query.status || row.status === query.status);
  const sorted = [...filtered].sort((a, b) => {
    if (!query.sort) return 0;
    const diff =
      query.sort === 'price' ? a.priceCents - b.priceCents : a.name.localeCompare(b.name);
    return query.order === 'desc' ? -diff : diff;
  });
  const totalPages = Math.ceil(sorted.length / query.limit);
  const start = (query.page - 1) * query.limit;
  return {
    items: sorted.slice(start, start + query.limit),
    pagination: {
      page: query.page,
      limit: query.limit,
      total: sorted.length,
      totalPages,
      hasNext: query.page < totalPages,
      hasPrev: query.page > 1,
    },
  };
}

const meta = {
  title: 'Organisms/DataTable',
  component: DataTable,
  tags: ['autodocs'],
  args: {
    caption: 'Produtos',
    columns: COLUMNS,
    rows: PRODUCTS.slice(0, 5),
    getRowKey: (row) => row.id,
    loading: false,
  },
  argTypes: {
    caption: { control: 'text', description: 'Nome da tabela para leitores de tela' },
    loading: { control: 'boolean', description: 'Recarregando com as linhas ainda na tela' },
    error: { control: 'text', description: 'Mensagem de erro; troca a tabela por um alerta' },
    columns: { control: false },
    rows: { control: false },
    getRowKey: { control: false },
    pagination: { control: false },
  },
} satisfies Meta<typeof DataTable<Product>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Mode 1: presentation only, no paging and no sort. */
export const Default: Story = {};

function PagedTable() {
  const table = useTableUrlState({ limits: [5] });
  const { items, pagination } = fakeApi(table.query);
  return (
    <DataTable
      caption="Produtos"
      columns={COLUMNS}
      rows={items}
      getRowKey={(row) => row.id}
      pagination={pagination}
      onPageChange={table.setPage}
    />
  );
}

/** Mode 2: paging kept in the URL (`page`). */
export const WithPagination: Story = {
  parameters: { controls: { disable: true } },
  render: () => <PagedTable />,
};

const FILTERS = [
  { value: undefined, label: 'Todos' },
  { value: 'active', label: 'Ativos' },
  { value: 'draft', label: 'Rascunhos' },
] as const;

function FilteredTable() {
  const table = useTableUrlState({
    sortable: ['name', 'price'],
    limits: [5, 10],
    filters: { status: ['active', 'draft'] },
  });
  const { items, pagination } = fakeApi(table.query);
  return (
    <div className="flex flex-col gap-4">
      <div role="group" aria-label="Filtrar por status" className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <Button
            key={label}
            size="sm"
            variant={table.state.filters.status === value ? 'primary' : 'outline'}
            aria-pressed={table.state.filters.status === value}
            onClick={() => {
              table.setFilter('status', value);
            }}
          >
            {label}
          </Button>
        ))}
      </div>
      <DataTable
        caption="Produtos"
        columns={COLUMNS}
        rows={items}
        getRowKey={(row) => row.id}
        pagination={pagination}
        onPageChange={table.setPage}
        sort={table.state.sort}
        order={table.state.order}
        onSortChange={table.toggleSort}
        empty={{ title: 'Nenhum produto com esse status', titleLevel: 3 }}
      />
    </div>
  );
}

/** Mode 3: sort in the header and filters, all in the URL (`sort`, `order`, `page`, `status`). */
export const WithFilters: Story = {
  parameters: { controls: { disable: true } },
  render: () => <FilteredTable />,
};

export const Loading: Story = { args: { rows: undefined } };

export const Empty: Story = {
  args: {
    rows: [],
    empty: {
      title: 'Você ainda não cadastrou produtos',
      description: 'Cadastre o primeiro para ele aparecer na sua loja.',
      icon: <PackageOpen />,
      action: <Button>Cadastrar produto</Button>,
    },
  },
};

export const WithError: Story = {
  args: {
    rows: undefined,
    error: 'Confira sua conexão e tente de novo.',
    onRetry: fn(),
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex flex-col gap-10">
      <DataTable
        caption="Simples"
        columns={COLUMNS}
        rows={PRODUCTS.slice(0, 3)}
        getRowKey={(row) => row.id}
      />
      <DataTable
        caption="Ordenada por preço"
        columns={COLUMNS}
        rows={PRODUCTS.slice(3, 6)}
        getRowKey={(row) => row.id}
        sort="price"
        order="desc"
        onSortChange={fn()}
        pagination={{ page: 2, limit: 3, total: 12, totalPages: 4, hasNext: true, hasPrev: true }}
        onPageChange={fn()}
      />
      <DataTable
        caption="Carregando"
        columns={COLUMNS}
        rows={undefined}
        getRowKey={(row) => row.id}
      />
      <DataTable
        caption="Vazia"
        columns={COLUMNS}
        rows={[]}
        getRowKey={(row) => row.id}
        empty={{ title: 'Nenhum produto com esse status', titleLevel: 3 }}
      />
      <DataTable
        caption="Com erro"
        columns={COLUMNS}
        rows={undefined}
        getRowKey={(row) => row.id}
        error="Confira sua conexão e tente de novo."
        onRetry={fn()}
      />
    </div>
  ),
};
