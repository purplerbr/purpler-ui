import { cva, type VariantProps } from 'class-variance-authority';

// Sizes come from the 4 px spacing token; the ring uses `primary`, which the tokens prove ≥ 3:1.
export const spinnerVariants = cva(
  'shrink-0 animate-spin text-primary motion-reduce:animate-none',
  {
    variants: {
      size: { sm: 'size-4', md: 'size-6', lg: 'size-10' },
    },
    defaultVariants: { size: 'md' },
  }
);

// The large spinner is the page fallback, so its label reads at body size.
export const spinnerLabelVariants = cva('inline-flex items-center gap-2 font-sans', {
  variants: {
    size: { sm: 'text-small', md: 'text-small', lg: 'text-body' },
  },
  defaultVariants: { size: 'md' },
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;
