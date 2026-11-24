import { cva } from 'class-variance-authority';

// The table scrolls sideways at 360 px, so its region takes keyboard focus (WCAG 2.1.1).
// `relative` keeps the sr-only caption inside the region instead of widening the page.
export const pricingTableVariants = cva([
  'relative overflow-x-auto rounded-xl border border-border bg-card font-sans text-card-foreground',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
]);

export const pricingTableCellVariants = cva('px-4 py-3 text-left align-top', {
  variants: {
    kind: {
      column: 'bg-muted font-display text-body font-bold text-foreground',
      // The row labels stay in view while the plan columns scroll.
      row: 'sticky left-0 w-40 bg-card font-semibold md:w-auto',
      corner: 'sticky left-0 bg-muted',
      value: '',
    },
  },
  defaultVariants: { kind: 'value' },
});
