import { cva, type VariantProps } from 'class-variance-authority';

// Pages move focus to the h1 with tabIndex -1; a heading is never tabbable, so no ring (2.4.7).
export const headingVariants = cva('font-display text-balance outline-none', {
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
