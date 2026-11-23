import { cva, type VariantProps } from 'class-variance-authority';

export const headingVariants = cva('font-display text-balance', {
  variants: {
    size: {
      display: 'text-display',
      'title-1': 'text-title-1',
      'title-2': 'text-title-2',
      'title-3': 'text-title-3',
    },
  },
});

export type HeadingVariants = VariantProps<typeof headingVariants>;
