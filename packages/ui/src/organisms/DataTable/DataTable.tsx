import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import { Alert, AlertDescription, AlertTitle } from '../../molecules/Alert/Alert';
import { EmptyState, type EmptyStateProps } from '../../molecules/EmptyState/EmptyState';
import { cn } from '../../utils/cn';
import {
  dataTableCellVariants,
  dataTablePaginationVariants,
  dataTableRegionVariants,
  dataTableSortButtonVariants,
  dataTableVariants,
} from './DataTable.variants';
import type { SortOrder } from './useTableUrlState';

export interface DataTableColumn<Row> {
  /** Also the `sort` value in the URL for a sortable column. */
  key: string;
  header: ReactNode;
  cell: (row: Row) => ReactNode;
  sortable?: boolean;
  /** `end` for numbers and money, so the digits line up. */
  align?: 'start' | 'end';
}

/** The `pagination` object of a paginated API response (§6.5). */
export interface DataTablePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export type DataTableProps<Row> = Omit<ComponentProps<'div'>, 'children'> & {
  /** Names the table, its scroll region and its pagination for screen readers. */
  caption: string;
  columns: readonly DataTableColumn<Row>[];
  /** `undefined` while the first page loads. */
  rows: readonly Row[] | undefined;
  getRowKey: (row: Row) => string;
  loading?: boolean | undefined;
  /** Error message; replaces the table with an alert and, with `onRetry`, a retry button. */
  error?: ReactNode;
  onRetry?: (() => void) | undefined;
  /** Shown when `rows` is empty, such as a message for the active filters. */
  empty?: EmptyStateProps;
  pagination?: DataTablePagination | undefined;
  onPageChange?: ((page: number) => void) | undefined;
  sort?: string | undefined;
  order?: SortOrder | undefined;
  onSortChange?: ((column: string) => void) | undefined;
};

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;
const SORT_ICON = { asc: ArrowUp, desc: ArrowDown } as const;
const LOADING_ROWS = 5;

function HeadCell<Row>({
  column,
  sort,
  order,
  onSortChange,
}: Pick<DataTableProps<Row>, 'sort' | 'order' | 'onSortChange'> & {
  column: DataTableColumn<Row>;
}) {
  const align = column.align ?? 'start';
  const sorted = sort === column.key && order !== undefined ? order : undefined;
  const canSort = column.sortable === true && onSortChange !== undefined;
  const Icon = sorted === undefined ? ArrowUpDown : SORT_ICON[sorted];

  return (
    <th
      scope="col"
      aria-sort={canSort ? (sorted === undefined ? 'none' : ARIA_SORT[sorted]) : undefined}
      className={dataTableCellVariants({ kind: 'head', align })}
    >
      {canSort ? (
        <button
          type="button"
          className={dataTableSortButtonVariants({ align })}
          onClick={() => {
            onSortChange(column.key);
          }}
        >
          {column.header}
          <Icon aria-hidden="true" />
        </button>
      ) : (
        column.header
      )}
    </th>
  );
}

function Pagination({
  caption,
  pagination,
  onPageChange,
}: {
  caption: string;
  pagination: DataTablePagination;
  onPageChange: ((page: number) => void) | undefined;
}) {
  const { page, totalPages, hasPrev, hasNext } = pagination;
  // aria-disabled keeps the focus on the button when the last page disables it.
  const go = (enabled: boolean, target: number) => () => {
    if (enabled) onPageChange?.(target);
  };

  return (
    <nav aria-label={`Paginação: ${caption}`} className={dataTablePaginationVariants()}>
      <p role="status">{`Página ${String(page)} de ${String(totalPages)}`}</p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          aria-disabled={!hasPrev}
          onClick={go(hasPrev, page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          Página anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          aria-disabled={!hasNext}
          onClick={go(hasNext, page + 1)}
        >
          Próxima página
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}

function Body<Row>({
  columns,
  rows,
  getRowKey,
}: Pick<DataTableProps<Row>, 'columns' | 'rows' | 'getRowKey'>) {
  if (rows === undefined)
    return Array.from({ length: LOADING_ROWS }, (_, index) => (
      <tr key={index}>
        {columns.map((column) => (
          <td key={column.key} className={dataTableCellVariants()}>
            <Skeleton className="h-4 w-full min-w-16" />
          </td>
        ))}
      </tr>
    ));

  return rows.map((row) => (
    <tr key={getRowKey(row)}>
      {columns.map((column) => (
        <td key={column.key} className={dataTableCellVariants({ align: column.align ?? 'start' })}>
          {column.cell(row)}
        </td>
      ))}
    </tr>
  ));
}

/** Controlled table: data, loading and errors come from the app; sort and page go back by callback. */
export function DataTable<Row>({
  className,
  caption,
  columns,
  rows,
  getRowKey,
  loading = false,
  error,
  onRetry,
  empty = { title: 'Nenhum item encontrado' },
  pagination,
  onPageChange,
  sort,
  order,
  onSortChange,
  ...props
}: DataTableProps<Row>) {
  const captionId = useId();
  const busy = loading || rows === undefined;
  const isEmpty = rows?.length === 0 && !loading;

  let content: ReactNode;
  if (error !== undefined)
    content = (
      <Alert variant="destructive">
        <AlertTitle>Não foi possível carregar: {caption}</AlertTitle>
        <AlertDescription className="flex flex-col items-start gap-3">
          {error}
          {onRetry ? (
            <Button variant="outline" size="sm" onClick={onRetry}>
              Tentar de novo
            </Button>
          ) : null}
        </AlertDescription>
      </Alert>
    );
  else if (isEmpty) content = <EmptyState {...empty} />;
  else
    content = (
      <div
        role="region"
        aria-labelledby={captionId}
        tabIndex={0}
        className={dataTableRegionVariants()}
      >
        <table aria-busy={busy || undefined} className="w-full border-collapse text-small">
          <caption id={captionId} className="sr-only">
            {caption}
          </caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <HeadCell
                  key={column.key}
                  column={column}
                  sort={sort}
                  order={order}
                  onSortChange={onSortChange}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            <Body columns={columns} rows={rows} getRowKey={getRowKey} />
          </tbody>
        </table>
      </div>
    );

  return (
    <div data-slot="data-table" className={cn(dataTableVariants(), className)} {...props}>
      <p role="status" className="sr-only">
        {busy && error === undefined ? `Carregando: ${caption}` : ''}
      </p>
      {content}
      {error === undefined && !isEmpty && pagination && pagination.totalPages > 1 ? (
        <Pagination caption={caption} pagination={pagination} onPageChange={onPageChange} />
      ) : null}
    </div>
  );
}
