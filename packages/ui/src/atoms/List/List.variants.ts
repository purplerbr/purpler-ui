import { cva, type VariantProps } from 'class-variance-authority';

// `text-start` keeps the items aligned to the reading edge inside centered parents (EmptyState).
export const listVariants = cva('grid gap-2 text-start font-sans', {
  variants: {
    marker: {
      disc: 'list-outside list-disc ps-6',
      none: 'list-none',
    },
  },
  defaultVariants: { marker: 'disc' },
});

export type ListVariants = VariantProps<typeof listVariants>;
