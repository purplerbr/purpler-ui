import { cva } from 'class-variance-authority';

export const dataTableVariants = cva('flex w-full flex-col gap-4');

// The table scrolls inside its region at 360 px, never the page; Tab reaches it to scroll.
export const dataTableRegionVariants = cva([
  'w-full overflow-x-auto rounded-lg border border-border bg-card text-card-foreground',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
]);

export const dataTableCellVariants = cva('px-4 py-3 align-middle whitespace-nowrap', {
  variants: {
    kind: {
      head: 'bg-muted text-start font-semibold text-muted-foreground',
      cell: 'border-t border-border',
    },
    align: { start: 'text-start', end: 'text-end' },
  },
  defaultVariants: { kind: 'cell', align: 'start' },
});

export const dataTableSortButtonVariants = cva(
  [
    'inline-flex min-h-6 cursor-pointer items-center gap-1 rounded-xs font-semibold',
    'hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2',
    'focus-visible:outline-ring [&>svg]:size-4 [&>svg]:shrink-0',
  ],
  {
    variants: { align: { start: '', end: 'flex-row-reverse' } },
    defaultVariants: { align: 'start' },
  }
);

export const dataTablePaginationVariants = cva(
  'flex flex-wrap items-center justify-between gap-3 text-small text-muted-foreground'
);
